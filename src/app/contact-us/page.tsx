import HomePageLayout from "../_partials/_layout/HomePageLayout";
export const metadata = {
  title: "Contact us",
};
export default function page() {
  return (
    <HomePageLayout>
      <div>
        <h1>We’d love to help</h1>
        <p> Reach out and we&apos;ll get back to you within 24 hours!</p>
        <form>
          <div>
            <div>
              <label htmlFor="first-name">First name</label>
              <input
                type="text"
                id="first-name"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="message"></label>
              <textarea
                name=""
                id="message"
                rows={3}
                placeholder="Leave a message"
              ></textarea>
            </div>
            <button type="submit">Send message</button>
          </div>
        </form>
      </div>
    </HomePageLayout>
  );
}
