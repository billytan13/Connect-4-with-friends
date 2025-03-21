/**
 * After all of the assets for our game our loaded, this scene is shown to the player.
 * The title scene launches the demo scene which has a game of Connect Four being played
 * in the background. Once the player is ready to start the game, if they click on this scene
 * this will stop the demo and launch the Game Scene.
 */

import * as Phaser from 'phaser';
import { GAME_ASSETS, SCENE_KEYS } from '../common';
import { authService } from '../services/auth-service';

export class TitleScene extends Phaser.Scene {
  #loginButton!: Phaser.GameObjects.Rectangle;
  #loginText!: Phaser.GameObjects.Text;
  #userText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  public create(): void {
    this.scene.launch(SCENE_KEYS.DEMO).sendToBack(SCENE_KEYS.DEMO);

    // disable input by default
    this.input.enabled = false;

    const titleText = this.add
      .text(this.scale.width / 2, 350, 'Connect Four', {
        fontFamily: GAME_ASSETS.DANCING_SCRIPT_FONT,
        fontSize: '200px',
      })
      .setOrigin(0.5);

    // Create login button
    this.#loginButton = this.add
      .rectangle(this.scale.width / 2, 550, 250, 50, 0x4285f4)
      .setInteractive()
      .setDepth(5);

    this.#loginText = this.add
      .text(this.scale.width / 2, 550, 'Sign in with Google', {
        fontFamily: GAME_ASSETS.DANCING_SCRIPT_FONT,
        fontSize: '28px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setDepth(6);

    // Add user text (will show username when logged in)
    this.#userText = this.add
      .text(this.scale.width / 2, 620, '', {
        fontFamily: GAME_ASSETS.DANCING_SCRIPT_FONT,
        fontSize: '24px',
      })
      .setOrigin(0.5)
      .setDepth(5);

    const clickToStartText = this.add
      .text(this.scale.width / 2, 700, 'Click to play', {
        fontFamily: GAME_ASSETS.DANCING_SCRIPT_FONT,
        fontSize: '80px',
      })
      .setAlpha(0)
      .setOrigin(0.5);

    // Add hover effects for login button
    this.#loginButton.on('pointerover', () => {
      this.#loginButton.setFillStyle(0x357abd);
    });
    this.#loginButton.on('pointerout', () => {
      this.#loginButton.setFillStyle(0x4285f4);
    });

    // Handle login click
    this.#loginButton.on('pointerdown', () => {
      void this.#handleLogin();
    });

    // Check if user is already logged in
    void this.#checkAuthStatus();

    this.add
      .timeline([
        {
          run: () => {
            titleText.setScale(0);
          },
        },
        {
          at: 100,
          tween: {
            targets: titleText,
            scaleY: 1.2,
            scaleX: 1.2,
            duration: 1500,
            ease: Phaser.Math.Easing.Sine.InOut,
          },
        },
        {
          at: 1500,
          tween: {
            targets: titleText,
            scaleY: 1,
            scaleX: 1,
            duration: 400,
            ease: Phaser.Math.Easing.Sine.InOut,
          },
        },
        {
          at: 2000,
          run: () => {
            this.input.enabled = true;
          },
        },
        {
          at: 2000,
          tween: {
            targets: clickToStartText,
            alpha: {
              start: 0,
              to: 1,
              from: 0.2,
            },
            duration: 1200,
            ease: Phaser.Math.Easing.Sine.InOut,
            yoyo: true,
            repeat: -1,
          },
        },
      ])
      .play();

    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
      this.cameras.main.fadeOut(1000, 31, 50, 110);
      this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.scene.stop(SCENE_KEYS.DEMO);
        this.scene.start(SCENE_KEYS.GAME);
      });
    });
  }

  async #handleLogin(): Promise<void> {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async #checkAuthStatus(): Promise<void> {
    try {
      const user = await authService.getCurrentUser();
      if (user?.email) {
        this.#loginButton.setVisible(false);
        this.#loginText.setVisible(false);
        this.#userText.setText(`Logged in as: ${user.email}`);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }
}
