(function(Scratch) {
  'use strict';

  class babyspenguinOSstuff {
    getInfo() {
      return {
        id: 'babyssystemmonitor',
        name: 'System Monitor',
        color1: '#00cc99',
        blocks: [
          {
            opcode: 'getGPURenderer',
            blockType: Scratch.BlockType.REPORTER,
            text: 'GPU name'
          },
          {
            opcode: 'getEquivalent',
            blockType: Scratch.BlockType.REPORTER,
            text: 'equivalent of [GPU_NAME]',
            arguments: {
              GPU_NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'NVIDIA GeForce GTX 1080'
              }
            }
          },
          {
            opcode: 'getConnectionType',
            blockType: Scratch.BlockType.REPORTER,
            text: 'connection type'
          },
          {
            opcode: 'getDownlinkSpeed',
            blockType: Scratch.BlockType.REPORTER,
            text: 'estimated speed (Mbps)'
          },
          {
            opcode: 'isOnline',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is online?'
          }
        ]
      };
    }

    getGPURenderer() {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'WebGL not supported';
      
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debug) return 'Privacy settings blocking GPU info';
      
      return gl.getParameter(debug.UNMASKED_RENDERER_WEBGL);
    }

    getEquivalent(args) {
      const gpu = (args.GPU_NAME || '').toUpperCase();
      const match = gpu.match(/\d+/);
      const num = match ? parseInt(match, 10) : 0;

      if (['INTEL', 'IRIS', 'UHD', 'MOBILE', 'LAPTOP', 'GRAPHICS'].some(x => gpu.includes(x))) {
        return "4070 TI";
      }

      if (gpu.includes('NVIDIA') || gpu.includes('GEFORCE')) {
        if (gpu.includes('RTX') && num >= 3000) return "5090";
        if (gpu.includes('RTX') || (gpu.includes('GTX') && num >= 1000)) return "4070 TI";
        return "Riva TNT 2"; 
      }

      if (gpu.includes('AMD') || gpu.includes('RADEON')) {
        if (gpu.includes('RX') && num >= 6000) return "5090";
        if (gpu.includes('RX') || gpu.includes('VEGA')) return "4070 TI";
        return "ATI Rage Pro";
      }

      return "Generic VGA";
    }

    getConnectionType() {
      const n = navigator;
      const conn = n.connection || n.mozConnection || n.webkitConnection;
      return conn ? (conn.type || "unknown") : "unsupported";
    }

    getDownlinkSpeed() {
      const n = navigator;
      const conn = n.connection || n.mozConnection || n.webkitConnection;
      return conn ? conn.downlink : 0;
    }

    isOnline() {
      return !!navigator.onLine;
    }
  }

  Scratch.extensions.register(new babyspenguinOSstuff());
})(Scratch);
