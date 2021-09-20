/**
 * @jest-environment node
 */
import spectron from 'spectron'
import { testWithSpectron } from 'vue-cli-plugin-electron-builder'
import fs from "fs";
import * as dotenv from "dotenv";
jest.setTimeout(50000)

try {
    fs.readFileSync(__dirname + `/../../../../.env`);
    dotenv.config({path: __dirname + `/../../../../.env`});
    console.log(__dirname);
} catch (e) {}

describe("Startup Electron App", () => {

    let spectronTest;
    let win;
    let client;


    test('Window Loads Properly', async () => {
        // Wait for dev server to start
        spectronTest = await testWithSpectron(spectron)
        win = spectronTest.app.browserWindow
        client = spectronTest.app.client

        expect(process.env.DS_TEST_VIEWER_EMAIL).toEqual("datasleuth.test.viewer@gmail.com")

        // Window was created
        expect(await client.getWindowCount()).toBe(1)
        // It is not minimized
        expect(await win.isMinimized()).toBe(false)
        // Window is visible
        expect(await win.isVisible()).toBe(true)
        // Size is correct
        const {width, height} = await win.getBounds()
        expect(width).toBeGreaterThan(0)
        expect(height).toBeGreaterThan(0)
        // App is loaded properly


       // await spectronTest.stopServe();
    })

    test('Register A User', async () => {

        const addUserButton = await client.$('#add-user-card');
        addUserButton.click();

        const nameField = await client.$('#Name');
        nameField.setValue("Test Name");

        const emailField = await client.$('#Email');
        emailField.setValue("test@datasleutmail.com");

        const passwordField = await client.$('#masterPassword');
        passwordField.setValue("datasleuthtestingpassword123");

        const checkPasswordField = await client.$('#masterPassCheck');
        checkPasswordField.setValue("datasleuthtestingpassword123");

        const vaultCheckBox = await client.$('.p-checkbox-box');
        vaultCheckBox.click();

        const registerButton = await client.$('#btnRegister');
        registerButton.click();

        const goToSearchButton = await client.$('#gotoSearch');
        goToSearchButton.click();


        expect(await client.getWindowCount()).toBe(1)
        // It is not minimized
        expect(await win.isMinimized()).toBe(false)

         await spectronTest.stopServe();
    })
})

