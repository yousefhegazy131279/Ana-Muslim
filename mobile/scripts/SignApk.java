import com.android.apksig.ApkSigner;
import com.android.apksig.ApkVerifier;
import java.io.File;
import java.io.FileInputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.Collections;

/** Signing material stays on the owner's computer and never enters the repository. */
public class SignApk {
  public static void main(String[] args) throws Exception {
    char[] password = System.getenv("AM_SIGNING_PASSWORD").toCharArray();
    KeyStore store = KeyStore.getInstance("JKS");
    try (FileInputStream stream = new FileInputStream(args[0])) { store.load(stream, password); }
    PrivateKey key = (PrivateKey) store.getKey("anamuslim", password);
    X509Certificate certificate = (X509Certificate) store.getCertificate("anamuslim");
    ApkSigner.SignerConfig signer = new ApkSigner.SignerConfig.Builder("anamuslim", key, Collections.singletonList(certificate)).build();
    new ApkSigner.Builder(Collections.singletonList(signer))
      .setInputApk(new File(args[1])).setOutputApk(new File(args[2]))
      .setMinSdkVersion(24).setV1SigningEnabled(true).setV2SigningEnabled(true)
      .setV3SigningEnabled(true).setV4SigningEnabled(false).build().sign();
    ApkVerifier.Result result = new ApkVerifier.Builder(new File(args[2])).build().verify();
    if (!result.isVerified() || !result.isVerifiedUsingV2Scheme()) throw new IllegalStateException("APK signature verification failed: " + result.getErrors());
    System.out.println("APK verified with v1/v2/v3 signatures");
  }
}
