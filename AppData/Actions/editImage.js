const Jimp = require('jimp');

let boilerplate = (name) => {return {
  name: name,
  data: {},
  UI: [
  {
    element: "text",
    text: "This Filter Has No Options"
  }
]}}

let plate = (name, data, UI, preview) => {
  return {
    name,
    data: data || {},
    UI,
    preview
  }
}

module.exports = {
  data: {
    name: "Edit Image",
  },
  category: "Images",
  UI: [
    {
      element: "image",
      storeAs: "image"
    },
    "-",
    {
      element: "menu",
      storeAs: "filters",
      name: "Filters",
      max: 50,
      types: {
        crop: "Crop",
        resize: "Resize",
        rotate: "Rotate",
        flipX: "Flip X",
        flipY: "Flip Y",
        greyscale: "Greyscale",
        opaque: "Opaque",
        contrast: "Contrast",
        background: "Set Background",
        brightness: "Brightness",
        invert: "Invert",
        dither: "16-Bit Dither",
        blur: "Blur",
        gaussian: "Gaussian Blur",
        sepia: "Sepia",
        posterize: "Posterize",
        pixelate: "Pixelate",
        mask: "Mask",
        composite: "Composite",
        replaceColor: "Replace Color"
      },
      UItypes: {
        greyscale: boilerplate("Greyscale"),
        sepia: boilerplate("Sepia"),
        opaque: boilerplate("Opaque"),
        flipX: boilerplate("Flip X"),
        flipY: boilerplate("Flip Y"),
        dither: boilerplate("16-Bit Dither"),
        invert: boilerplate("Invert"),
        replaceColor: plate("Replace Color", {replace: "#000000", replaceWith: "#FFFFFF"}, [
          {
            element: "input",
            name: "Color To Replace",
            storeAs: "replace",
            placeholder: "HEX Code"
          },
          "-",
          {
            element: "input",
            name: "Color To Replace With",
            storeAs: "replaceWith",
            placeholder: "HEX Code"
          },
          "-",
          {
            element: "input",
            name: "Delta",
            storeAs: "delta",
            placeholder: "0"
          }
        ]),
        contrast: plate("Contrast", {change: 100}, [
          {
            name: "New Contrast Value",
            storeAs: "change",
            element: "input"
          },
          "_",
          {
            element: "text",
            text: "Minimum: 0<br> Maximum: 200"
          }
        ], "`New Contrast Value: ${option.data.change}`"),
        brightness: plate("Brightness", {change: 100}, [
          {
            name: "New Brightness Value",
            storeAs: "change",
            element: "input"
          },
          "_",
          {
            element: "text",
            text: "Minimum: 0<br> Maximum: 200"
          }
        ], "`New Brightness Value: ${option.data.change}`"),
        mask: plate("Mask", {x: "0", y: "0"}, [
          {
            element: "image",
            name: "Mask",
            storeAs: "image"
          },
          "-",
          {
            element: "inputGroup",
            storeAs: ["x", "y"],
            nameSchemes: ["Mask X Coordinates", "Mask Y Coordinates"]
          }
        ]),
        composite: plate("Composite", {x: "0", y: "0"}, [
          {
            element: "image",
            name: "Composite",
            storeAs: "image"
          },
          "-",
          {
            element: "inputGroup",
            storeAs: ["x", "y"],
            nameSchemes: ["Composite X Coordinates", "Composite Y Coordinates"]
          }
        ]),
        background: plate("Background", {}, [
          {
            element: "image",
            name: "Background",
            storeAs: "image"
          },
        ]),
        blur: plate("Blur", {blur: '1'}, [
          {
            element: "input",
            name: "Blur Amount",
            storeAs: "blur"
          },
          "_",
          {
            element: "text",
            text: "Minimum: 0<br> Maximum: 100"
          }
        ], "`Blur Amount: ${option.data.blur}`"),
        gaussian: plate("Gaussian Blur", {blur: '1'}, [
          {
            element: "input",
            name: "Blur Amount",
            storeAs: "blur"
          },
          "_",
          {
            element: "text",
            text: "Minimum: 0<br> Maximum: 100"
          }
        ], "`Blur Amount: ${option.data.blur}`"),
        posterize: plate("Posterize", {amount: "10"}, [
          {
            element: "input",
            name: "Amount",
            storeAs: "amount"
          }
        ], "`Amount: ${option.data.amount}`"),
        rotate: plate("Rotate", {degrees: "45"}, [
          {
            element: "input",
            name: "Degrees",
            storeAs: "amount",
          },
        ], "`Rotate To ${option.data.amount} Degrees`"),
        crop: plate("Crop", {x: "", y: "", w: "", h: ""},  [
          {
            element: "input",
            name: "X Crop",
            storeAs: "x"
          },
          "_",
          {
            element: "input",
            name: "Y Crop",
            storeAs: "y"
          },
          "-",
          {
            element: "input",
            name: "Width Crop",
            storeAs: "w"
          },
          "_",
          {
            element: "input",
            name: "Height Crop",
            storeAs: "h"
          }
        ]),
        resize: plate("Resize", {}, [
          {
            element: "input",
            storeAs: "w",
            name: "New Width"
          },
          "-",
          {
            element: "input",
            storeAs: "h",
            name: "New Height"
          }
        ]),
        pixelate: plate("Pixelate", {}, [
          {
            name: "Pixelation Amount",
            storeAs: "amount",
            element: "input"
          },
          "_",
          {
            element: "text",
            text: "Minimum: 0<br> Maximum: 100"
          }
        ])
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],
  subtitle: (data, constants) => {
    return `${data.filters.length} Effects`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    /**
     * @type {Uint8Array}
     */

    let img = await bridge.getImage(values.image);
    let t = bridge.transf;

    const jimp = require('jimp');
    
    let image = await jimp.read(img);

    await new Promise(res => {values.filters.forEach(async (baseFilter, ind) => {
        let type = baseFilter.type;
        let filter = baseFilter.data;
        
        switch (type) {
          case 'crop':
            await image.crop(Number(t(filter.x)), Number(t(filter.y)), Number(t(filter.h)), Number(t(filter.w)))
          break
          case 'resize':
            await image.resize(Number(t(filter.w)), Number(t(filter.h)))
          break
          case 'rotate':
            await image.rotate(Number(t(filter.amount)))
          break
          case 'gaussian':
            await image.gaussian(Number(t(filter.blur)))
          break
          case 'blur':
            await image.blur(Number(t(filter.blur)))
          break
          case 'flipX':
            await image.flip(false, true)
          break
          case 'flipY':
            await image.flip(true, false)
          break
          case 'greyscale':
            await image.greyscale()
          break
          case 'opaque':
            await image.opaque();
          break
          case 'contrast':
            await image.contrast(Number(t(filter.amount)))
          break
          case 'brightness':
            await image.contrast(Number(t(filter.amount)))
          break
          case 'pixelate':
            await image.pixelate(Number(t(filter.amount)))
          break
          case 'posterize':
            await image.posterize(Number(t(filter.amount)))
          break
          case 'mask':
            let imgToRead = await bridge.getImage(filter.image)
            let mask = await jimp.read(imgToRead)
            await image.mask(mask, Number(t(filter.x)), Number(t(filter.y)));
          break
          case 'composite':
            let imgToGet = await bridge.getImage(filter.image)
            let composite = await jimp.read(imgToGet)
            await image.composite(composite, Number(t(filter.x)), Number(t(filter.y)));
          break
          case 'background':
            let imgToBackground = await bridge.getImage(filter.image)
            let background = await jimp.read(imgToBackground);
            await image.composite(background, 0, 0, {opacityDest: 0});
          break
          case 'replaceColor':
            const replaceColor = require('replace-color');
            let imageToReplace = await image.getBufferAsync(jimp.AUTO);
            await new Promise(resolve => {
              replaceColor({
                image: imageToReplace,
                deltaE: Number(t(filter.delta)),
                colors: {
                  type: 'hex',
                  targetColor: t(filter.replace),
                  replaceColor: t(filter.replaceWith)
                }
              }).then(replacedImage => {
                replacedImage = replacedImage;
                image = null;
                image = replacedImage;
                resolve();
              });
            })

          break
          case 'dither':
            await image.dither16()
          break
          case 'invert':
            await image.invert()
          break
          case 'sepia':
            await image.sepia()
          break
        }
        if (ind == values.filters.length - 1) {
          res()
        }
      }
      )})

      let imageBuffer = await image.getBufferAsync(Jimp.AUTO);

    bridge.store(values.store, imageBuffer)
  },
};
