# Remapp.ing Beta

Remapp.ing is the **first and only open-source remapper for platform fighting digital controllers**, designed to be the **universal remapping solution** for all HayBox-based controllers. Whether you're remapping built-in game modes, or tweaking SOCD, Remapp.ing provides a powerful yet intuitive interface for complete controller customization.

---

## Features
- **First Open-Source HayBox Remapper:** Built to support all HayBox-based controllers and expandable by developers worldwide.
- **Universal Controller Support:** Easily adapt third-party controllers with our planned layout tools (available in a future beta release).
- **Built-in Game Modes:** Support for several predefined modes, with ongoing additions for even more games.
- **SOCD Features:** Change SOCD modes for all defined options, and create new ones on the fly.
- **Advanced Monitoring Tools:** View and debug controller serial output with ease.

---

## Easter Eggs
Press the `/` key on the Remapp.ing page to unlock hidden tools for advanced users! These include:
- **Serial Monitor:** A live view of serial communication between your controller and the app for debugging.
- **Recolor Engine:** Customize the color scheme of the Remapp.ing interface to match your preferences or controller design.
- **Controller Emulation:** Test your configurations with a built-in controller emulator to ensure everything works as expected before saving changes.

Give these features a try and take your customization to the next level!

---

## Getting Started

1. **Download the Firmware Files:**
   - [Nuke.uf2](https://github.com/Gadgetoid/pico-universal-flash-nuke/releases/download/v1.0.1/universal_flash_nuke.uf2)
   - [GRAMConfig.uf2](https://github.com/GRAMCTRL/HayBox-GRAM/releases/tag/v0.1beta)
2. **Enter Boot Select Mode:**
   - Hold the **START** button on your GRAM controller while plugging it into your PC via USB.  
   - A file explorer window will pop up.
3. **Flash the Firmware:**
   - Drag and drop `Nuke.uf2` into the file explorer.
   - Wait for the file explorer to close and reopen (this takes about 10 seconds).
   - Drag and drop `GRAMConfig.uf2` into the file explorer.
   - Once it closes again, unplug your controller.
4. **Reconnect Your Controller:**
   - Open [Remapp.ing](https://remapp.ing/) in Chrome.
   - Hold **START** while plugging your controller back in.
   - Click **CONNECT** and select your controller from the Chrome popup menu.
   - Continue to Proceed to remap. Use the interface to:
     - Adjust mappings.
     - Select different modes (bottom left corner).
     - Reset your configuration using the **Nuke** button.
     - Export your configuration by clicking the **Floppy Disc Save** icon.

---

## FAQ

### Q: I just loaded the new GRAMConfig.uf2 on my controller. How do I swap back to my previous firmware?
1. Hold **A** while plugging in your controller.  
2. Drag and drop `Nuke.uf2` into the file explorer.  
3. Drag and drop your previous firmware file into the file explorer.

### Q: What can I expect with the Remapp.ing Beta?
- As this is a Beta release, you may encounter bugs or limitations.
- *Note:* **Rivals 2 Mode** is not yet available but will be included in a future beta update.

### Q: Where do I report bugs or errors?
- Submit bug reports in our issues panel.

### Q: What browsers are supported?
- Currently, **Chrome** is the only supported browser.

### Q: Is this compatible with all GRAM controllers?
- Yes, Remapp.ing supports all GRAM Slim SMASH models.  
- As an open-source project, additional controllers will be supported in future updates.  
- Third-party developers can add layouts via a simple integration tool.

*Controller manufacturers*: Open a support ticket in the [GRAM Discord](https://discord.gg/tSHztv5d) to stay updated on third-party support.

---

## Acknowledgements
- Huge thanks to [**Haystack**](https://github.com/JonnyHaystack) for developing the HayBox firmware and serial protocol, without which this project wouldn't be possible.  
- A special shoutout to [**@bvoo**](https://github.com/bvoo) for the amazing work on Remapp.ing. More exciting features are on the way! 🎉

---

## Feedback
Tried Remapp.ing Beta? Let us know your thoughts and give this project a ⭐ on GitHub! 🚀
