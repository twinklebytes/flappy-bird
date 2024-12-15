import React, { useEffect } from 'react';
import Phaser from 'phaser';

const FlappyBirdGame = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 800,
      height: 600,
      backgroundColor: '#4DC1F9',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    let bird;
    let pipes;
    let score = 0;
    let scoreText;
    let gameOver = false;
    let gameOverText;
    let clouds;
    let mountains;
    let sounds = {};
    let gameStarted = false;

    function preload() {
      // Load sounds
      this.load.audio('flap', '/assets/sounds/flap.mp3');
      this.load.audio('score', '/assets/sounds/score.mp3');
      this.load.audio('hit', '/assets/sounds/hit.mp3');

      // Create game textures
      this.load.on('complete', () => {
        // Create bird texture with better graphics
        const birdGraphics = this.add.graphics();
        // Body
        birdGraphics.fillStyle(0xFDD835);
        birdGraphics.fillCircle(16, 16, 16);
        // Eye
        birdGraphics.fillStyle(0xFFFFFF);
        birdGraphics.fillCircle(24, 12, 6);
        birdGraphics.fillStyle(0x000000);
        birdGraphics.fillCircle(26, 12, 3);
        // Wing
        birdGraphics.lineStyle(3, 0xFBC02D);
        birdGraphics.beginPath();
        birdGraphics.arc(12, 16, 8, 0, Math.PI);
        birdGraphics.strokePath();
        
        birdGraphics.generateTexture('bird', 32, 32);
        birdGraphics.destroy();

        // Create pipe texture with better graphics
        const pipeGraphics = this.add.graphics();
        // Main pipe body
        pipeGraphics.fillStyle(0x2E7D32);
        pipeGraphics.fillRect(0, 0, 60, 600);
        // Pipe highlight
        pipeGraphics.fillStyle(0x4CAF50);
        pipeGraphics.fillRect(5, 0, 10, 600);
        // Pipe top/bottom
        pipeGraphics.fillStyle(0x1B5E20);
        pipeGraphics.fillRect(-10, 0, 80, 30);
        
        pipeGraphics.generateTexture('pipe', 60, 600);
        pipeGraphics.destroy();

        // Create cloud texture
        const cloudGraphics = this.add.graphics();
        cloudGraphics.fillStyle(0xFFFFFF);
        cloudGraphics.fillCircle(20, 20, 20);
        cloudGraphics.fillCircle(35, 20, 15);
        cloudGraphics.fillCircle(50, 20, 20);
        cloudGraphics.generateTexture('cloud', 70, 40);
        cloudGraphics.destroy();

        // Create mountain texture
        const mountainGraphics = this.add.graphics();
        mountainGraphics.fillStyle(0x795548);
        mountainGraphics.beginPath();
        mountainGraphics.moveTo(0, 200);
        mountainGraphics.lineTo(200, 0);
        mountainGraphics.lineTo(400, 200);
        mountainGraphics.closePath();
        mountainGraphics.fill();
        mountainGraphics.generateTexture('mountain', 400, 200);
        mountainGraphics.destroy();
      });
    }

    function create() {
      // Create background elements
      mountains = this.add.group();
      for (let i = 0; i < 3; i++) {
        const mountain = this.add.image(i * 350, 600, 'mountain');
        mountain.setOrigin(0, 1);
        mountain.setAlpha(0.7);
        mountain.setDepth(0);
        mountains.add(mountain);
      }

      clouds = this.add.group();
      for (let i = 0; i < 5; i++) {
        const cloud = this.add.image(
          Phaser.Math.Between(0, 800),
          Phaser.Math.Between(50, 200),
          'cloud'
        );
        cloud.setAlpha(0.8);
        cloud.setDepth(1);
        clouds.add(cloud);
      }

      // Initialize bird
      bird = this.physics.add.sprite(200, 300, 'bird');
      bird.setCollideWorldBounds(true);
      bird.body.allowGravity = false;
      bird.setDepth(3);

      // Initialize pipes
      pipes = this.physics.add.group();

      // Score text (top layer)
      scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff',
        fontFamily: 'Arial',
        stroke: '#000',
        strokeThickness: 4,
        backgroundColor: '#00000066',
        padding: { x: 10, y: 5 },
        borderRadius: 5
      });
      scoreText.setDepth(10); // Highest depth to stay on top
      scoreText.setScrollFactor(0); // Makes sure it stays fixed on screen

      // Game over text (initially hidden)
      gameOverText = this.add.container(400, -200);
      gameOverText.setDepth(11);
      
      const panel = this.add.rectangle(0, 0, 500, 250, 0x000000, 0.7);
      panel.setOrigin(0.5);
      
      const title = this.add.text(0, -70, 'Game Over!', {
        fontSize: '48px',
        fill: '#fff',
        fontFamily: 'Arial',
        stroke: '#000',
        strokeThickness: 6
      });
      title.setOrigin(0.5);
      
      const finalScore = this.add.text(0, 0, '', {
        fontSize: '32px',
        fill: '#fff',
        fontFamily: 'Arial'
      });
      finalScore.setOrigin(0.5);
      
      const restart = this.add.text(0, 70, 'Click or press SPACE to restart', {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Arial'
      });
      restart.setOrigin(0.5);
      
      gameOverText.add([panel, title, finalScore, restart]);
      gameOverText.setVisible(false);

      // Load and setup sounds
      sounds.flap = this.sound.add('flap', { volume: 0.5 });
      sounds.score = this.sound.add('score', { volume: 0.5 });
      sounds.hit = this.sound.add('hit', { volume: 0.7 });

      // Start text
      const startText = this.add.text(400, 300, 'Click or press SPACE to start', {
        fontSize: '32px',
        fill: '#fff',
        fontFamily: 'Arial',
        stroke: '#000',
        strokeThickness: 4
      });
      startText.setOrigin(0.5);

      // Input handlers
      this.input.keyboard.on('keydown-SPACE', handleInput);
      this.input.on('pointerdown', handleInput);

      function handleInput() {
        if (!gameStarted) {
          startGame();
          startText.destroy();
        } else if (!gameOver) {
          flapBird();
        } else {
          restartGame();
        }
      }
    }

    function update() {
      if (!gameStarted) return;

      // Move clouds
      clouds.getChildren().forEach(cloud => {
        cloud.x -= 0.5;
        if (cloud.x < -100) cloud.x = 900;
      });

      // Rotate bird based on velocity
      bird.angle = Phaser.Math.Clamp(bird.body.velocity.y / 10, -30, 90);

      // Check for collisions
      this.physics.overlap(bird, pipes, gameOverHandler, null, this);

      // Update pipes
      pipes.getChildren().forEach((pipe) => {
        if (pipe.x < -pipe.width) {
          pipe.destroy();
        }
        
        if (!pipe.scored && pipe.x < bird.x) {
          pipe.scored = true;
          score += 0.5;
          scoreText.setText('Score: ' + Math.floor(score));
          sounds.score.play();
        }
      });

      // Add new pipes
      if (pipes.countActive() < 6) {
        if (pipes.getChildren().length === 0 || 
            pipes.getChildren()[pipes.getChildren().length - 1].x < 600) {
          addPipe();
        }
      }
    }

    function startGame() {
      gameStarted = true;
      gameOver = false;
      bird.body.allowGravity = true;
      addPipe();
    }

    function addPipe() {
      const gap = 200;
      const gapPosition = Phaser.Math.Between(150, 450);
      
      const topPipe = pipes.create(800, gapPosition - gap/2, 'pipe');
      const bottomPipe = pipes.create(800, gapPosition + gap/2, 'pipe');
      
      topPipe.setOrigin(0, 1);
      topPipe.setDepth(2);
      bottomPipe.setOrigin(0, 0);
      bottomPipe.setDepth(2);  
      
      topPipe.body.allowGravity = false;
      bottomPipe.body.allowGravity = false;
      
      topPipe.body.velocity.x = -200;
      bottomPipe.body.velocity.x = -200;
      
      topPipe.scored = false;
      bottomPipe.scored = false;
    }

    function flapBird() {
      if (gameOver) return;
      bird.body.velocity.y = -400;
      sounds.flap.play();
    }

    function gameOverHandler() {
      if (gameOver) return;
      
      gameOver = true;
      sounds.hit.play();
      
      bird.body.allowGravity = false;
      bird.body.velocity.y = 0;
      bird.body.velocity.x = 0;
      
      pipes.getChildren().forEach((pipe) => {
        pipe.body.velocity.x = 0;
      });

      // Show game over container with animation
      gameOverText.getAt(2).setText(`Final Score: ${Math.floor(score)}`);
      gameOverText.setVisible(true);
      this.tweens.add({
        targets: gameOverText,
        y: 300,
        duration: 500,
        ease: 'Bounce'
      });
    }

    function restartGame() {
      // Hide game over container
      gameOverText.y = -200;
      gameOverText.setVisible(false);
      
      score = 0;
      scoreText.setText('Score: 0');
      pipes.clear(true, true);
      bird.setPosition(200, 300);
      bird.setAngle(0);
      gameOver = false;
      gameStarted = true;
      bird.body.allowGravity = true;
      addPipe();
    }

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="w-full h-full flex items-center justify-center" />;
};

export default FlappyBirdGame;