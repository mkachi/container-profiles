# 🔒 Container Profiles for Firefox

This is a WebExtension that enhances Firefox's container tab functionality by treating each container as if it were a **separate user profile**.

## ✨ Features

- Remembers the selected container and automatically opens all tabs in it
- Changes the extension icon based on the selected container's icon (using Lucide icons)
- Shows the selected container's name as a tooltip
- Replaces existing tabs with new ones in the selected container (`replaceTab`)
- Allows programmatic control of container behavior

## 📸 Preview

> (Add screenshots or GIFs here if available)

## 🛠 Installation (For Developers)

1. Clone this repository:

    ```bash
    git clone https://github.com/your-username/container-profiles.git
    cd container-profiles
    ```

2. In Firefox, go to `about:debugging` → "This Firefox" → "Load Temporary Add-on"  
3. Select the folder containing `manifest.json`

## 🧠 Project Structure

| File | Description |
|------|-------------|
| `background.js` | Main logic for container switching, icon updates, and tab redirection |
| `popup.html` / `popup.js` | UI for selecting containers |
| `icons/` | Lucide icon SVG files |
| `manifest.json` | Extension definition file |

## 🎨 Icon Attribution

This extension uses icons from the [Lucide](https://lucide.dev) project.

> Lucide is an open-source icon library licensed under the MIT License.  
>  
> © Lucide Contributors - [https://github.com/lucide-icons/lucide](https://github.com/lucide-icons/lucide)

These icons are included in the `icons/` folder and are used directly by the extension.

## 📄 License

MIT License

```
MIT License

Copyright (c) 2025 mkachi

Permission is hereby granted, free of charge, to any person obtaining a copy...
```

## 📢 Contribution

Pull requests and issues are welcome! Feel free to suggest improvements or new features.

### 📌 P.S.
Honestly, I made this for myself. 😄