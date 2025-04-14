import HomePageLayout from "../_partials/_layout/HomePageLayout";

export const metadata = {
  title: "Join Event",
};
export default function page() {
  return (
    <HomePageLayout>
      <div>
        <h1>Join a Live Event Instantly!</h1>
        <p>
          No signup needed. Just scan the QR code or enter the event code to
          join.
        </p>
        <div>
          <input type="text" />
          <button type="submit">Join now</button>
        </div>
      </div>
    </HomePageLayout>
  );
}
