# remapp.ing

remapp.ing is an **open-source remapper** designed for **leverless Haybox controllers** (for platform and traditional fighting games). It uses **the Haybox protocol** in conjunction with **Haybox's configuration branch** (soon to be merged to main under **3.0.0**) to generate configuration files that can manipulate the bindings of mapped buttons in the firmware, allowing for users to remap their controllers without editing the original firmware files, all in a beautiful, simple UI.

---

## Features
- **Open-Source HayBox Remapper:** Built to support all HayBox-based controllers and expandable by developers worldwide.
- **Universal Controller Support:** Easily adapt third-party controllers with our [visual layout editor](https://remapp.ing/editor).
- **Built-in Game Modes:** Support for several predefined modes, with ongoing additions for even more games.
- **SOCD Features:** Change SOCD modes for all defined options, and create new ones on the fly.

---

## Easter Eggs
Press the `/` key on the remapp.ing page to unlock hidden tools for advanced users! These include:
- **Serial Console:** Interact with your controller over serial for debugging.
- **Theme Editor:** Customize the color scheme of the remapp.ing interface to match your preferences or controller design.
- **Controller Emulation:** Use the built-in controller emulator to test your changes when contributing to remapp.ing.

Give these features a try and take your customization to the next level!

---

## Getting Started

1. **Download the Firmware Files:**
   - [Nuke.uf2](https://github.com/Gadgetoid/pico-universal-flash-nuke/releases/download/v1.0.1/universal_flash_nuke.uf2)
   - [firmware.uf2](https://github.com/GRAMCTRL/HayBox-GRAM/releases/)
     - Please note that if your device is not listed in the releases here, you'll likely want to look for firmware from your controller manufacturer. Make sure that it uses Haybox 3.0.0+!
2. **Enter Boot Select Mode:**
   - Hold the **A** button on your controller while plugging it into your PC via USB.
      - If you aren't on a GRAM controller, **START** is a common button to enter BOOTSEL mode. Double check with your controller manufacturer if you have any issues with this.
   - A file explorer window will pop up.
3. **Flash the Firmware:**
   - Drag and drop `Nuke.uf2` into the file explorer.
   - Wait for the file explorer to close and reopen (this takes about 10 seconds).
   - Drag and drop `firmware.uf2` into the file explorer.
   - Once it closes again, unplug your controller.
4. **Reconnect Your Controller:**
   - Open [remapp.ing](https://remapp.ing/) in Chrome.
   - Hold **START** while plugging your controller back in to enter CONFIG mode.
      - If you aren't on a GRAM controller, other common buttons to enter CONFIG mode include **C-Down**, **A**, and **C-Right**. Double check with your controller manufacturer if you have any issues with this.
   - Click **CONNECT** and select your controller from the WebSerial popup menu.
      - Please note that only Chromium browsers support WebSerial.
      - If you're on Firefox, there may be WebSerial add-ons that add support, however they may not work with remapp.ing. 
   - Continue to Proceed to remap. Use the interface to:
     - Adjust mappings.
     - Select different modes to remap in the bottom left corner.
     - Reset your current modes remappings using the **Nuclear Bomb** button.
     - Save your configuration to your controller by clicking the **Floppy Disc Save** icon.
     - Exit config mode by rebooting your controller from the **Power** button.

---

## FAQ

### Q: I just flashed new firmware on my controller. How do I swap back to my previous firmware?
1. Hold **A** while plugging in your controller.
   - If you're using another manufacturers firmware, this button may vary. **START** is a common button to enter BOOTSEL mode. Double check with your controller manufacturer if you have any issues with this.
2. Drag and drop `Nuke.uf2` into the file explorer.
3. Drag and drop your previous firmware file into the file explorer.

### Q: Where do I report bugs or errors?
- Please report bugs using our [Bug Report Issue Template](https://github.com/GRAMCTRL/remapp.ing/issues/new?template=bug_report.md), or in the [GRAMCTRL Discord](https://www.gramctrl.com/discord), under the #ask-for-help > GRAM Remapp.ing forum channel.

### Q: What browsers are supported?
- Currently, only Chromium has support for [WebSerial](https://caniuse.com/web-serial).
- Firefox may work with various WebSerial add-ons, however they may not work with remapp.ing.

### Q: Is this compatible with all GRAM controllers?
- Remapp.ing is designed to work with the GRAM Slim, nanoGRAM, and PRI$M controllers. Any additional controller support is not guaranteed by the maintainers of this project.  
- As an open-source project, additional controllers will be supported in future updates.
- Third-party developers can create layouts using the [Visual Editor](https://remapp.ing/editor).

### Q: It isn't working! What do I do?
- Verify that you're using Haybox 3.0.0+, as previous versions don't support CONFIG mode.
- Make sure that you're holding down the button to enter CONFIG mode when you plug in your controller.
- Remember that remapp.ing will only work on Chromium based browsers, as other browsers don't support WebSerial.

*Controller manufacturers*: Take a look at the [CONTRIBUTING.md](https://github.com/GRAMCTRL/remapp.ing/blob/master/CONTRIBUTING.md) to get your controller added, and feel free to open a support ticket in the [GRAM Discord](https://www.gramctrl.com/discord) if you have any questions.

---

## Acknowledgements
- Huge thanks to [**Haystack**](https://github.com/JonnyHaystack) for developing the HayBox firmware and serial protocol, without which this project wouldn't be possible.  
- A special shoutout to [**@bvoo**](https://github.com/bvoo) for the amazing work on remapp.ing. More exciting features are on the way! 🎉

---

## Feedback
Tried remapp.ing? Let us know your thoughts and give this project a ⭐ on GitHub! 🚀
