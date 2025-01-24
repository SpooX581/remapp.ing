# Contributing to remapp.ing
*This guide is intended for third party controller manufacturers to add their controllers to remapp.ing. Other contributions are welcome, but procedures aren't outlined here.*

We’re excited that you want to contribute to remapp.ing by adding your controller layouts! This guide will walk you through the steps to create and submit your custom controller layouts for integration into remapp.ing.

## Steps for Adding a New Controller Layout

### Access the Visual Editor
  - First, open up the [remapp.ing visual editor](https://remapp.ing/editor). This tool will allow you to easily design your controller layout and generate the corresponding JSON file.

### Create Your Controller Layout
  - Start designing your controller layout.
    - You can download an existing layout from [here](https://github.com/GRAMCTRL/remapp.ing/tree/master/public/layouts) and base your work off of that, or start from scratch.
  - To start from scratch, follow these steps:
    1. Click clear on the bottom bar to wipe the pre-filled data away.
    2. Go into the properties panel, and fill in the blanks.
      1. The layout name is what will be shown to users in the layout selection page.
      2. Device name is what will be used for auto-detection when a user plugs their controller in. Your firmware will need to provide this name in response to the GET_CONFIG Haybox command. See [Haybox-GRAM](https://github.com/GRAMCTRL/HayBox-GRAM/blob/GRAM-config/platformio.ini#L14) as an example.
      3. Device pattern is a regex field that can be used if multiple names should be detected for the same layout. You likely won't need to fill this field out.
      4. The button naming convention is what will be shown to you in the editor next to the buttons you place. We recommend leaving this on Haybox.
      5. Add all of the buttons that are set in your firmware to the buttons section.
      6. Add each mode supported by your firmware in the modes section.
    3. Add your buttons, and drag them around to match your controllers layout.
       - You can click on each button and precisely move them by holding shift and dragging on the X/Y fields under the inspector tab..
    4. Head into the inspector tab, click on each button and set the physical button and its respective binds for each mode to match what it's set to in Haybox.
    5. Click into the SOCD tab, and set each pairing for each mode.
    6. If your firmware uses hidden buttons, add them in the panel called hidden.
       - Hidden buttons are buttons that are not physically present on the controller, but are set in firmware.
       - We use these so that users can bind every button even if they aren't usually on the controller. This is mostly a hack to work around Haybox limitations.
       - See [Haybox-GRAM](https://github.com/GRAMCTRL/HayBox-GRAM/commit/ac8f5f5d9f075cbabf232be28906629335cf8555) for an example of hidden buttons.
    7. Using the view layout as mode selector in the bottom right, give everything a quick double check to make sure it looks right, then hit the export button and save the resulting JSON file.

### Post-processing the JSON File
  - Make sure you have git, pnpm, and a recent version of node installed
  - Fork this repository with `git clone https://github.com/GRAMCTRL/remapp.ing.git`
  - Open it up in an IDE of your choice (we use VSCode).
  - In the `/public/layouts/` folder, make a new folder for your controllers. Keep naming all lowercase, one word, no symbols.
  - Drag your new JSON into this new folder, and make sure that the file name is also all lowercase, one word, no symbols.
  - Right after the first `{` at the start of the JSON file, add this line:
    - `"$schema": "../layout_schema.json",`
  - Next, under each mode remove any lines with bindings that are set to `unspecified`.
    - ![image](https://github.com/user-attachments/assets/f08d3ca6-9345-4005-ab0c-6616fba23e7a)
  - Give the file a quick format.
  - With a terminal in the root folder of the project, run the following:
    - `pnpm install`
    - `pnpm genIndex`
    - `pnpm dev`
  - This will install the project dependencies, regenerate the index that we use to find each layout, and start a dev server.
   
### Test Your Layout
   - With this new dev server, pull up [http://localhost:5173/](http://localhost:5173/) and verify that your newly added layout works by connecting your controller.
     - Reminder: Auto detection needs your firmware to report the device name the same as you specified earlier on in the properties panel.

### Submit Your Layout
   - Commit your changes to the repo, and push them to your fork.
     - `git add .`
     - `git commit -m "Added support for ReallyCool XYZ controller.`
     - `git push`
   - Open a [Pull Request](https://github.com/GRAMCTRL/remapp.ing/compare) (PR) to this repository with your new layout.
   - Done!

If you have any questions, feel free to open up a ticket in the [GRAMCTRL Discord](https://www.gramctrl.com/discord)!

## License

By contributing, you agree that the data provided with your submission is licensed under the project's GPLv3 license.
