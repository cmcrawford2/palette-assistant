const initialData = {
  colors: {
    'color-1': { id: 'color-1', color: ["aliceblue", 240, 248, 255]},
    'color-2': { id: 'color-2', color: ['antiquewhite', 250, 235, 215] },
    'color-3': { id: 'color-3', color: ['aqua', 0, 255, 255] },
    'color-4': { id: 'color-4', color: ['aquamarine', 127, 255, 212] },
    'color-5': { id: 'color-5', color: ['azure', 240, 255, 255] },
    'color-6': { id: 'color-6', color: ['beige', 245, 245, 220] },
    'color-7': { id: 'color-7', color: ['bisque', 255, 228, 196] },
    'color-8': { id: 'color-8', color: ['black', 0, 0, 0] },
    'color-9': { id: 'color-9', color: ['blanchedalmond', 255, 235, 205] },
  },
  palettes: {
    'palette-1': {
      id: 'palette-1',
      title: 'My Palette',
      colorIds: ['color-1', 'color-2', 'color-3',
                 'color-4', 'color-5', 'color-6',
                 'color-7', 'color-8', 'color-9'],
    },
  },
  // Facilitate reordering of the columns
  paletteOrder: ['palette-1'],
};

export default initialData;