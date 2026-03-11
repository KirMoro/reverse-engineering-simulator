export const steps = [
  {
    id: 1,
    title: 'Reading the Manifest',
    subtitle:
      'The attacker unpacks the APK and starts with AndroidManifest.xml to map entry points and exposed components.',
    left: {
      kind: 'code',
      language: 'xml',
      filename: 'AndroidManifest.xml',
      code: `<activity android:name="com.finpay.app.LoginActivity"
    android:exported="true">
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
  </intent-filter>
</activity>
<activity android:name="com.finpay.app.PaymentActivity" />
<activity android:name="com.finpay.app.AdminPanelActivity"
    android:exported="true" />
<service android:name="com.finpay.app.TransactionSyncService" />`,
      highlightLines: [8, 9, 10],
      tooltips: {
        8: 'The admin panel class is visible immediately, revealing a privileged workflow.',
        9: 'Exported=true means another app on the device can try to launch this activity directly.',
        10: 'Service names leak internal architecture and give attackers more targets to inspect.',
      },
    },
    right: {
      kind: 'code',
      language: 'xml',
      filename: 'AndroidManifest.xml',
      code: `<activity android:name="com.finpay.app.LoginActivity"
    android:exported="true">
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
  </intent-filter>
</activity>
<activity android:name="com.finpay.app.PaymentActivity" />
<!-- AdminPanelActivity: exported=false, not externally reachable -->
<activity android:name="com.finpay.app.AdminPanelActivity"
    android:exported="false" />
<service android:name="com.finpay.app.TransactionSyncService"
    android:permission="com.finpay.app.INTERNAL" />`,
      highlightLines: [8, 10, 12],
      tooltips: {
        10: 'Sensitive screens stay private when they are not exported outside the app sandbox.',
        12: 'A custom permission gates service access even if an attacker knows the component name.',
      },
    },
    annotation: {
      title: 'Exposed Entry Points',
      leftText:
        "The attacker immediately sees all activities, including an admin panel that's exported and callable from other apps on the device. The package structure also exposes the app's internal architecture.",
      rightText:
        "Sensitive activities are not exported, and custom permissions restrict service access. The manifest still exists, but it yields much less useful attack surface.",
      riskTag: 'Architecture Disclosure · Unauthorized Access',
      timeToExploit: {
        left: '~30 seconds',
        right: 'Needs another weakness to pivot',
      },
    },
  },
  {
    id: 2,
    title: 'Decompiling the Code',
    subtitle:
      'Once JADX produces readable source, secrets and business logic either fall out instantly or stay buried behind obfuscation and runtime guards.',
    left: {
      kind: 'code',
      language: 'java',
      filename: 'PaymentProcessor.java',
      code: `public class PaymentProcessor {
    private static final String API_KEY = "sk_demo_live_example_only_4eC39";
    private static final String API_ENDPOINT = "https://api.example-finpay.test/v2/charge";

    public void processPayment(CreditCard card, int amount) {
        HttpClient client = new HttpClient();
        JSONObject payload = new JSONObject();
        payload.put("card_number", card.getNumber());
        payload.put("cvv", card.getCvv());
        payload.put("amount", amount);
        payload.put("api_key", API_KEY);
        client.post(API_ENDPOINT, payload);
    }
}`,
      highlightLines: [2, 3, 8, 9, 11, 12],
      tooltips: {
        2: 'A hardcoded production-style API token becomes recoverable as soon as the APK is decompiled.',
        3: 'Endpoints reveal backend shape, versioning, and candidate APIs to abuse.',
        9: 'Sensitive card data is plainly visible in business logic, making hooks trivial to place later.',
        12: 'The transport call shows exactly where stolen data needs to be intercepted or replayed.',
      },
    },
    right: {
      kind: 'code',
      language: 'java',
      filename: 'a0x3f.java',
      code: `public class a0x3f {
    private static final String a = x9c.d(new byte[]{0x7a, 0x2e, (byte)0xf1, 0x33, 0x42});
    private static final String b = x9c.d(new byte[]{0x4b, (byte)0xa8, 0x19, 0x6c});

    public void a(c0x7b p1, int p2) {
        if (n4.isDebugged() || n4.isRooted() || n4.isEmulator()) {
            throw new RuntimeException();
        }
        g7x p3 = new g7x();
        k9z p4 = new k9z();
        p4.a(p3.e("a1"), p1.b());
        p4.a(p3.e("b2"), p1.c());
        p4.a(p3.e("c3"), p2);
        p4.a(p3.e("d4"), a);
        p3.b(b, p4);
    }
}`,
      highlightLines: [2, 6, 11, 14, 15],
      tooltips: {
        2: 'Readable secrets are gone. The string only becomes useful after runtime decryption in memory.',
        6: 'RASP-style checks abort the path if the device looks hostile or instrumented.',
        15: 'Even the final network call is obscured, which slows down static analysis and hook targeting.',
      },
    },
    annotation: {
      title: 'Hardcoded Secrets and Business Logic',
      leftText:
        'API keys, endpoint URLs, and complete payment logic are plainly visible. An attacker can extract credentials in under a minute and start replaying backend calls.',
      rightText:
        'Class and method names are obfuscated, strings are encrypted, and runtime checks screen for debuggers, rooted devices, and emulators before sensitive logic runs.',
      riskTag: 'Credential Theft · API Abuse · Logic Exposure',
      timeToExploit: {
        left: '~1 minute',
        right: 'Much harder - advanced dynamic analysis required',
      },
    },
  },
  {
    id: 3,
    title: 'Extracting Strings',
    subtitle:
      'Static string extraction is the cheapest win for an attacker. If secrets survive compilation in plaintext, they tend to spill immediately.',
    left: {
      kind: 'terminal',
      title: 'strings classes.dex',
      lineDelay: 340,
      lines: [
        {
          kind: 'prompt',
          text: '$ strings classes.dex | grep -i "key\\|secret\\|password\\|token\\|api"',
        },
        { kind: 'blank', text: '' },
        { kind: 'found', text: '[FOUND] sk_demo_live_example_only_4eC39' },
        { kind: 'found', text: '[FOUND] https://api.example-finpay.test/v2/charge' },
        { kind: 'found', text: '[FOUND] X-Auth-Token' },
        {
          kind: 'found',
          text: '[FOUND] mongodb+srv://demo_user:DemoOnlyPass@cluster0.example-finpay.test',
        },
        { kind: 'found', text: '[FOUND] firebase_api_key=AIzaSyDemoOnly_NotARealKey' },
        { kind: 'found', text: '[FOUND] AWS_SECRET_KEY=DEMO_ONLY_SECRET_NOT_REAL' },
        { kind: 'found', text: '[FOUND] PIN_MASTER_KEY=0011223344556677DEMO' },
        { kind: 'found', text: '[FOUND] JWT_SIGNING_SECRET=demo_only_jwt_secret_2026' },
      ],
    },
    right: {
      kind: 'terminal',
      title: 'strings classes.dex',
      lineDelay: 340,
      lines: [
        {
          kind: 'prompt',
          text: '$ strings classes.dex | grep -i "key\\|secret\\|password\\|token\\|api"',
        },
        { kind: 'blank', text: '' },
        { kind: 'warn', text: '[FOUND] x9c0a3f_encrypted_blob_1' },
        { kind: 'warn', text: '[FOUND] 0x7a2ef13342a8f90c' },
        { kind: 'warn', text: '[FOUND] KeYdEcRyPtOr_native_call' },
        { kind: 'blank', text: '' },
        { kind: 'status', text: '> 3 results found. None appear to be usable credentials.' },
        {
          kind: 'status',
          text: '> Encrypted blobs detected - runtime decryption suspected.',
        },
      ],
    },
    annotation: {
      title: 'The Strings Goldmine',
      leftText:
        'A simple strings dump reveals API keys, database credentials, auth headers, and master keys. This is one of the most common mobile weaknesses because it is both easy to introduce and easy to exploit.',
      rightText:
        'Sensitive strings are encrypted at build time and only decrypted in memory. Static grep returns blobs, not reusable credentials.',
      riskTag: 'Credential Exposure · Data Breach',
      timeToExploit: {
        left: '< 1 minute',
        right: 'Static analysis stalls out quickly',
      },
      highlightStat:
        'In large-scale mobile app reviews, hardcoded secrets still show up regularly because build pipelines rarely fail on them by default.',
    },
  },
  {
    id: 4,
    title: 'Tampering with the App',
    subtitle:
      'If control-flow checks are readable and integrity is weak, a single byte change can flip security decisions and unlock paid or restricted behavior.',
    left: {
      kind: 'code',
      language: 'smali',
      filename: 'LoginActivity.smali',
      code: `# Original check in LoginActivity
.method public validateLicense()Z
    const/4 v0, 0x0        # isValid = false

    invoke-virtual {p0}, Lcom/finpay/app/LicenseChecker;->checkServer()Z
    move-result v0

    return v0               # returns server response
.end method

# PATCHED by attacker - always returns true
.method public validateLicense()Z
    const/4 v0, 0x1        # isValid = true (FORCED)
    return v0               # bypasses server check entirely
.end method`,
      highlightLines: [10, 12, 13],
      tooltips: {
        10: 'Once the app is rebuilt from smali, the original trust decision can be replaced with attacker-controlled logic.',
        12: 'Changing 0x0 to 0x1 forces the validation result to true.',
        13: 'The server check is gone completely, which is why repackaging becomes useful for fraud and piracy.',
      },
      statusText: '✓ Repackaged. ✓ Resigned. ✓ Installed.',
      statusTone: 'danger',
    },
    right: {
      kind: 'code',
      language: 'smali',
      filename: 'a.smali',
      code: `# Obfuscated + integrity check
.method public a()Z
    invoke-static {}, Lx9c/n4;->checkIntegrity()V
    # verifies APK signature at runtime
    # if tampered, the app terminates immediately

    invoke-static {}, Lx9c/n4;->checkDebugger()V
    # detects Frida, Xposed, and other hooking frameworks

    const/4 v0, 0x0
    invoke-virtual {p0}, La0x/b3;->a()Z
    move-result v0
    return v0
.end method`,
      highlightLines: [3, 6, 10],
      tooltips: {
        3: 'Runtime integrity checks make a modified APK fail on launch, even if it rebuilds successfully.',
        6: 'Anti-hooking checks add another independent gate the attacker has to bypass at runtime.',
      },
      statusText: '✗ Repackaged -> crash on launch. Integrity check failed.',
      statusTone: 'safe',
    },
    annotation: {
      title: 'Patch, Repackage, Redistribute',
      leftText:
        'License checks, payment validation, and feature flags can be bypassed by editing one small branch in smali. The modified APK can then be redistributed or used internally for abuse.',
      rightText:
        "Integrity checks verify the app's signature on launch, and anti-hooking logic looks for instrumentation frameworks. Tampering now means defeating several independent defenses at once.",
      riskTag: 'App Tampering · Piracy · Fraud',
      timeToExploit: {
        left: '~5 minutes',
        right: 'Needs multiple bypasses in parallel',
      },
    },
  },
  {
    id: 5,
    title: 'Runtime Attack - Hooking with Frida',
    subtitle:
      'Dynamic instrumentation skips rebuilding entirely. The attacker hooks live methods, intercepts sensitive values, and changes behavior while the app runs.',
    left: {
      kind: 'terminal',
      title: 'frida console',
      lineDelay: 170,
      lines: [
        { kind: 'prompt', text: '$ frida -U -f com.finpay.app -l hook-payment.js' },
        { kind: 'blank', text: '' },
        {
          kind: 'code',
          language: 'javascript',
          text: '// Frida script - hooking payment validation',
        },
        { kind: 'code', language: 'javascript', text: 'Java.perform(function() {' },
        {
          kind: 'code',
          language: 'javascript',
          text: '  var PaymentProcessor = Java.use("com.finpay.app.PaymentProcessor");',
        },
        { kind: 'code', language: 'javascript', text: '' },
        {
          kind: 'code',
          language: 'javascript',
          text: '  PaymentProcessor.processPayment.implementation = function(card, amount) {',
        },
        {
          kind: 'code',
          language: 'javascript',
          text: '    console.log("[*] Intercepted payment!");',
        },
        {
          kind: 'code',
          language: 'javascript',
          text: '    console.log("[*] Card: " + card.getNumber());',
        },
        {
          kind: 'code',
          language: 'javascript',
          text: '    console.log("[*] CVV: " + card.getCvv());',
        },
        {
          kind: 'code',
          language: 'javascript',
          text: '    sendToAttacker(card, amount);',
        },
        {
          kind: 'code',
          language: 'javascript',
          text: '    return this.processPayment(card, 0);',
        },
        { kind: 'code', language: 'javascript', text: '  };' },
        { kind: 'code', language: 'javascript', text: '});' },
        { kind: 'blank', text: '' },
        {
          kind: 'success',
          text: '✓ Hook installed. Intercepting all payment calls...',
        },
      ],
    },
    right: {
      kind: 'terminal',
      title: 'frida console',
      lineDelay: 170,
      lines: [
        { kind: 'prompt', text: '$ frida -U -f com.finpay.app -l hook-payment.js' },
        { kind: 'blank', text: '' },
        {
          kind: 'code',
          language: 'javascript',
          text: '// Frida script - attempting to hook',
        },
        { kind: 'code', language: 'javascript', text: 'Java.perform(function() {' },
        {
          kind: 'code',
          language: 'javascript',
          text: '  var target = Java.use("com.finpay.app.PaymentProcessor");',
        },
        {
          kind: 'error',
          text: '  // ClassNotFoundException: com.finpay.app.PaymentProcessor',
        },
        { kind: 'code', language: 'javascript', text: '' },
        { kind: 'code', language: 'javascript', text: '  var target2 = Java.use("a0x3f");' },
        {
          kind: 'warn',
          text: '  // Class found, but method names are randomized per build',
        },
        {
          kind: 'code',
          language: 'javascript',
          text: '  target2.a.implementation = function(p1, p2) {',
        },
        {
          kind: 'error',
          text: '    // App crashed - RASP detected Frida attachment',
        },
        {
          kind: 'error',
          text: '    // Process terminated with SIGKILL',
        },
        { kind: 'code', language: 'javascript', text: '  };' },
        { kind: 'code', language: 'javascript', text: '});' },
        { kind: 'blank', text: '' },
        {
          kind: 'error',
          text: '✗ Connection lost. Target process terminated.',
        },
      ],
    },
    annotation: {
      title: 'Live Interception - The Runtime Attack',
      leftText:
        'Tools like Frida can hook methods live, intercept values in transit, and override return values without touching the APK. That makes runtime data theft and fraud fast to prototype.',
      rightText:
        'Obfuscated names make targets harder to discover, anti-hooking can kill the process when instrumentation is detected, and build-to-build variation invalidates old scripts quickly.',
      riskTag: 'Data Interception · Real-time Fraud · Full App Compromise',
      timeToExploit: {
        left: '~2 minutes',
        right: 'Extremely difficult - multiple runtime checks to defeat',
      },
    },
  },
];

export const summaryMetrics = [
  {
    label: 'Time to extract credentials',
    left: '< 1 min',
    right: 'Significantly harder',
  },
  {
    label: 'Readable class and method names',
    left: 'Near 100%',
    right: '< 5%',
  },
  {
    label: 'Hardcoded secrets found',
    left: '8',
    right: '0 readable',
  },
  {
    label: 'Successful code tampering',
    left: 'Trivial',
    right: 'Detected and blocked',
  },
  {
    label: 'Runtime hook success',
    left: 'Full access',
    right: 'Process terminated',
  },
];

export const actionItems = [
  {
    title: 'Scan every mobile app build for secrets',
    body: 'Run static analysis against each release artifact and fail CI when API keys, tokens, credentials, or signing material appear in the mobile app bundle.',
  },
  {
    title: 'Use code obfuscation beyond platform defaults',
    body: 'Default shrinkers reduce readability, but layered code obfuscation, string protection, and control-flow hardening make app decompilation much less useful to an attacker.',
  },
  {
    title: 'Add runtime protection checks',
    body: 'Detect debuggers, root or jailbreak conditions, hooking frameworks, emulators, and integrity failures before sensitive mobile app features execute.',
  },
  {
    title: 'Monitor reverse engineering after release',
    body: 'Treat production as hostile. Track tampering, repackaging, and instrumentation activity in the wild, then feed those signals back into your secure release process.',
  },
];

export const resources = [
  {
    title: 'OWASP Mobile Application Security',
    href: 'https://mas.owasp.org/',
    description: 'A practical baseline for mobile app security testing, architecture review, and hardening.',
  },
  {
    title: 'OWASP Mobile Top 10',
    href: 'https://owasp.org/www-project-mobile-top-10/',
    description: 'A concise view of the most common mobile app security risks and failure patterns.',
  },
  {
    title: 'Android Security Best Practices',
    href: 'https://developer.android.com/topic/security/best-practices',
    description: 'Official guidance for secure Android app design, storage, networking, and hardening.',
  },
];

export const faqs = [
  {
    question: 'What is mobile app reverse engineering?',
    answer:
      'Mobile app reverse engineering is the process of unpacking, decompiling, and inspecting an app binary to recover code, secrets, architecture details, and business logic. Attackers use it to map entry points, steal credentials, tamper with app logic, and prepare runtime hooks.',
  },
  {
    question: 'Can code obfuscation stop app decompilation on its own?',
    answer:
      'No. Code obfuscation makes app decompilation less readable, but it does not remove attack paths by itself. Stronger results come from layering obfuscation with string encryption, integrity checks, anti-hooking defenses, and secure backend validation.',
  },
  {
    question: 'How can I tell whether my mobile app exposes secrets?',
    answer:
      'Start by scanning the release binary, not just the source code. Run static analysis, inspect decompiled output, and search extracted strings for API keys, tokens, endpoints, certificates, and database credentials. If the binary reveals them, an attacker can usually find them too.',
  },
];

export const openSourceTools = ['MobSF', 'JADX', 'APKTool'];
