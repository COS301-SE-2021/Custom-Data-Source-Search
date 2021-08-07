module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                appId: "com.abstraction.datasleuth",
                productName: "DataSleuth",
                win: {
                    target: ["nsis"],
                    icon: 'src/assets/DataSleuth.ico'
                },
                nsis: {
                    installerIcon: "src/assets/DataSleuth.ico",
                    uninstallerIcon: "src/assets/DataSleuth.ico",
                    uninstallDisplayName: "DataSleuth",
                    license: "src/assets/licenses/license.txt",
                    oneClick: false,
                    allowToChangeInstallationDirectory: true
                },
                linux: {
                    target: ["deb", "pacman"],
                    icon: 'src/assets/DataSleuth.ico',
                    category: "Utility"

                }
            }
        }
    }
}