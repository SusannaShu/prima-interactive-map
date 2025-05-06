# How to Update the Interactive Map Content using Contentful

This guide explains how to add, edit, or remove information about art installations and artists displayed on the Prima Interactive Map using the Contentful platform. No coding is required!

## 1. What is Contentful?

Contentful is a Content Management System (CMS) where all the text, images, and details for the map are stored. Using Contentful allows updates to be made easily through a web interface without needing to change the map's code.

## 2. Video Tutorial

A helpful video walkthrough is available here (you might need permission to view it):

**[Watch the Contentful Update Tutorial](https://drive.google.com/file/d/1ebKF70hrMcnRHFXbk5GsgtRUpC5T0hE5/view?usp=sharing)**

It's recommended to watch this video first for a visual guide.

## 3. Logging In

1.  Go to the Contentful login page: [https://app.contentful.com/](https://app.contentful.com/)
2.  Log in using the provided email address and password.
3.  If you belong to multiple organizations or spaces, ensure you select the correct space (e.g., "Prima Interactive Map"). (Or click to go to [https://app.contentful.com/spaces/9lr2p7f5uhit/home](https://app.contentful.com/spaces/9lr2p7f5uhit/home))

## 4. Understanding the Interface

Once logged in and navigated to Spaces -> Prima Interactive Map, the main sections you'll use are:

*   **Content:** This is where you'll find all the existing entries for Art Installations and Artists.
*   **Media:** This is where all uploaded images (for installations and artists) are stored.

## 5. Working with Artists

You need to add Artist entries *before* you can link them to an Art Installation.

### Finding Existing Artists

1.  Go to the **Content** section.
2.  You should see a list of content types. Click on **Artist**.
3.  This will show a list of all artists currently in the system.
4.  Click on an artist's name to view or edit their details.

### Adding a New Artist

1.  Go to the **Content** section.
2.  Click the **Add entry** button (usually near the top right) and select **Artist**.
3.  Fill in the fields:
    *   **Name:** The artist's full name.
    *   **Photo:** Click **Add media** -> **Add new media**. Upload the artist's photo here and give it a recognizable title (like the artist's name). Select the uploaded photo.
    *   **School:** The artist's school or affiliation.
    *   **Location:** Enter the artist's location (e.g., "City, Country"). You will likely need to enter this for both English (`en-US`) and French (`fr`) tabs if localization is enabled.
    *   **Website:** The artist's website URL or social media handle (e.g., `artistwebsite.com` or `@artist_social`). Use `...` if not applicable.
4.  Click **Save** (or the initial save button).
5.  **IMPORTANT:** Click the **Publish** button. Changes won't appear on the live map until published!

### Editing an Artist

1.  Find the artist in the **Content -> Artist** list.
2.  Click on their name.
3.  Make your desired changes to the fields.
4.  Click **Save**.
5.  **IMPORTANT:** Click **Publish** again to make the changes live.

## 6. Working with Art Installations

### Finding Existing Installations

1.  Go to the **Content** section.
2.  Click on **Art Installation**.
3.  This shows a list of all installations.
4.  Click on an installation's name to view or edit.

### Adding a New Installation

1.  Go to the **Content** section.
2.  Click **Add entry** and select **Art Installation**.
3.  Fill in the fields:
    *   **Name:** The title of the artwork. Enter both English (`en-US`) and French (`fr`).
    *   **Description:** The description of the artwork. Enter both English (`en-US`) and French (`fr`).
    *   **Year:** The year the artwork was created (e.g., `2024`).
    *   **Dimensions:** The physical size (e.g., `550x550x270cm`).
    *   **Materials:** What the artwork is made of. Enter both English (`en-US`) and French (`fr`).
    *   **Coordinates:** Click **Select location**. Search for the address or manually drop a pin on the map to set the exact latitude and longitude.
    *   **Main Image:** Click **Add media** -> **Add new media**. Upload the main photo for the installation. Select the uploaded photo.
    *   **Artists:** Click **Link existing entries**. A list of existing Artists will appear. Select the artist(s) involved with this installation. You can link multiple artists.
4.  Click **Save**.
5.  **IMPORTANT:** Click **Publish**. If you linked any new *draft* Artists, you might need to publish them first.

### Editing an Installation

1.  Find the installation in the **Content -> Art Installation** list.
2.  Click on its name.
3.  Make changes to any fields (text, coordinates, main image, linked artists).
4.  Click **Save**.
5.  **IMPORTANT:** Click **Publish** to make the edits live.

## 7. Key Reminders

*   **PUBLISH, PUBLISH, PUBLISH!** Saving a draft is not enough. Changes (new entries or edits) MUST be published to appear on the map.
*   **Artists First:** Add artist entries before adding installations that feature them.
*   **Languages:** Fill in both English (`en-US`) and French (`fr`) fields where available.
*   **Media:** Upload images directly via the **Add media** buttons within the entries.

If you encounter any issues or have questions, please refer back to the video tutorial or contact the project administrator. 