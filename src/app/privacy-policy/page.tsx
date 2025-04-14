import HomePageLayout from "../_partials/_layout/HomePageLayout";

export const metadata = {
  title: "Privacy Policy",
};

export default function page() {
  return (
    <HomePageLayout>
      <div>
        <h2> Privacy Policy</h2>
        <p>
          Sprekar (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, and safeguard your information when you use our
          mobile app and web services.
        </p>
        <div>
          <div>
            <h3>1. Information We Collect</h3>
            <ul>
              <li>
                Personal Information: Name, email, language preferences, and
                optionally a profile picture.
              </li>
              <li>
                Audio Data: Real-time speech input for transcription and
                translation purposes (not stored permanently).
              </li>
              <li>
                Usage Data: Device information, app usage statistics, crash logs
                and interaction history.
              </li>
            </ul>
          </div>
          <div>
            <h3>1. Information We Collect</h3>
            <ul>
              <li>
                Personal Information: Name, email, language preferences, and
                optionally a profile picture.
              </li>
              <li>
                Audio Data: Real-time speech input for transcription and
                translation purposes (not stored permanently).
              </li>
              <li>
                Usage Data: Device information, app usage statistics, crash logs
                and interaction history.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </HomePageLayout>
  );
}
