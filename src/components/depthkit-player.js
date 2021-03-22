/**
 * Loads a depthkit capture\
 * @namespace depthkit-player
 * @component depthkit-player
 */
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    TextureLoader,
    AdditiveBlending,
    PointsMaterial,
    Points,
    Vector3,
    CatmullRomCurve3,
    Object3D
  } from "three";
  
  import { isNonCorsProxyDomain, guessContentType, proxiedUrlFor } from "../utils/media-url-utils";
  
  import "depthkit";
  
  //AFrame DepthKit.js wrapper entity
  AFRAME.registerComponent("depthkit-player", {
    schema: {
      type: { type: "string", default: "mesh" },
      metaPath: { type: "string" },
      videoPath: { type: "string" }
    },
  
    /**
     * Set if component needs multiple instancing.
     */
    multiple: true,
  
    player: null,
    character: null,
  
    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function() {
      console.log("Depthkit init " + this.data.videoPath);
      this.loadVideo();
    },
  
    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function(oldData) {},
  
    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function() {
      console.log("Depthkit remove");
      this.el.object3D.remove(this.character);
      delete this.player;
    },
  
    /**
     * Called on each scene tick.
     */
    tick: function(t) {},
    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function() {},
  
    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function() {},
  
    loadVideo: function() {
      const scene = this.el.sceneEl.object3D;
  
      if (this.data.metaPath.length < 5) {
        const isMp4 = this.data.videoPath.toLowerCase().endsWith(".mp4");
        if (isMp4) {
          this.data.metaPath = this.data.videoPath.substring(0, this.data.videoPath.length - 4) + ".txt";
        } else {
          console.error("depthkit-player: video url invalid:" + this.data.videoPath);
          return;
        }
      }
  
      console.log("Depthkit loadVideo - meta:" + this.data.metaPath + " video:" + this.data.videoPath);
  
      this.player = new Depthkit();
      this.player.load(proxiedUrlFor(this.data.metaPath), proxiedUrlFor(this.data.videoPath), dkCharacter => {
        this.character = dkCharacter;
  
        console.log("Depthkit Loaded");
  
        //Position and rotation adjustments
        //dkCharacter.rotation.set( Math.PI - 0.25, 0, Math.PI / -2.0 );
        // dkCharacter.rotation.y = Math.PI;
        this.character.position.set(0, 1.0, 0);
  
        // Depthkit video playback control
        //this.player.video.muted = "muted"; // Necessary for auto-play in chrome now
        this.player.setLoop(true);
        this.player.play();
  
        //Add the character to the scene
        this.el.object3D.add(this.character);
        this.el.emit("video-loaded", { projection: "depthkit3d" });
      });
    }
  });
  