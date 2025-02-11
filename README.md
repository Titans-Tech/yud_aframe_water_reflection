# Aframe Water With Reflection

## How to use

1. import libary:
```
  <script src="Refractor.js"></script>
```

<br/>

```
  <script src="Reflector.js"></script>
```

<br/>

```
  <script src="Water.js"></script>
```

<br/>

<br/>
2. add entity:

```
  <a-plane id="water" position="0 1 0" rotation="-90 0 0" width="300" height="300" water="color: #cad3cc; textureWidth: 512; textureHeight: 512; flowDirectionX: 0.01; flowDirectionY: -0.08; flowSpeed: 0.03"></a-plane>
```

<br/>
3. adjust option:

```
  color: (type: string, default: '#ffffff')
  textureWidth: (type: integer, default: 512)
  textureHeight: (type: integer, default: 512)
  flowDirectionX: (type: integer, default: 0.0)
  flowDirectionY: (type: integer, default: -0.08)flowSpeed: type: (integer, default: 0.02)
```
