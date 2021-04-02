const initialData = {
  randomMode: false,

  // Weights are from the internet.
  gWeight: 0.587,
  rWeight: 0.299,
  bWeight: 0.114,

  colors: {
    'color-1': { id: 'color-1', color: ["aliceblue", 240, 248, 255] },
    'color-2': { id: 'color-2', color: ['antiquewhite', 250, 235, 215] },
    'color-3': { id: 'color-3', color: ['aqua', 0, 255, 255] },
    'color-4': { id: 'color-4', color: ['aquamarine', 127, 255, 212] },
    'color-5': { id: 'color-5', color: ['azure', 240, 255, 255] },
    'color-6': { id: 'color-6', color: ['beige', 245, 245, 220] },
    'color-7': { id: 'color-7', color: ['bisque', 255, 228, 196] },
    'color-8': { id: 'color-8', color: ['black', 0, 0, 0] },
    'color-9': { id: 'color-9', color: ['blanchedalmond', 255, 235, 205] },
    'color-10': { id: 'color-10', color: ['blue', 0, 0, 255] },
    'color-11': { id: 'color-11', color: ['blueviolet', 138, 43, 226] },
    'color-12': { id: 'color-12', color: ['brown', 165, 42, 42] },
    'color-13': { id: 'color-13', color: ['burlywood', 222, 184, 135] },
    'color-14': { id: 'color-14', color: ['cadetblue', 95, 158, 160] },
    'color-15': { id: 'color-15', color: ['chartreuse', 127, 255, 0] },
    'color-16': { id: 'color-16', color: ['chocolate', 210, 105, 30] },
    'color-17': { id: 'color-17', color: ['coral', 255, 127, 80] },
    'color-18': { id: 'color-18', color: ['cornflowerblue', 100, 149, 237] },
    'color-19': { id: 'color-19', color: ['cornsilk', 255, 248, 220] },
    'color-20': { id: 'color-20', color: ['crimson', 220, 20, 60] },
    'color-21': { id: 'color-21', color: ['cyan', 0, 255, 255] },
    'color-22': { id: 'color-22', color: ['darkblue', 0, 0, 139] },
    'color-23': { id: 'color-23', color: ['darkcyan', 0, 139, 139] },
    'color-24': { id: 'color-24', color: ['darkgoldenrod', 184, 134, 11] },
    'color-25': { id: 'color-25', color: ['darkgray', 169, 169, 169] },
    'color-26': { id: 'color-26', color: ['darkgreen', 0, 100, 0] },
    'color-27': { id: 'color-27', color: ['darkgrey', 169, 169, 169] },
    'color-28': { id: 'color-28', color: ['darkkhaki', 189, 183, 107] },
    'color-29': { id: 'color-29', color: ['darkmagenta', 139, 0, 139] },
    'color-30': { id: 'color-30', color: ['darkolivegreen', 85, 107, 47] },
    'color-31': { id: 'color-31', color: ['darkorange', 255, 140, 0] },
    'color-32': { id: 'color-32', color: ['darkorchid', 153, 50, 204] },
    'color-33': { id: 'color-33', color: ['darkred', 139, 0, 0] },
    'color-34': { id: 'color-34', color: ['darksalmon', 233, 150, 122] },
    'color-35': { id: 'color-35', color: ['darkseagreen', 143, 188, 143] },
    'color-36': { id: 'color-36', color: ['darkslateblue', 72, 61, 139] },
    'color-37': { id: 'color-37', color: ['darkslategray', 47, 79, 79] },
    'color-38': { id: 'color-38', color: ['darkslategrey', 47, 79, 79] },
    'color-39': { id: 'color-39', color: ['darkturquoise', 0, 206, 209] },
    'color-40': { id: 'color-40', color: ['darkviolet', 148, 0, 211] },
    'color-41': { id: 'color-41', color: ['deeppink', 255, 20, 147] },
    'color-42': { id: 'color-42', color: ['deepskyblue', 0, 191, 255] },
    'color-43': { id: 'color-43', color: ['dimgray', 105, 105, 105] },
    'color-44': { id: 'color-44', color: ['dimgrey', 105, 105, 105] },
    'color-45': { id: 'color-45', color: ['dodgerblue', 30, 144, 255] },
    'color-46': { id: 'color-46', color: ['firebrick', 178, 34, 34] },
    'color-47': { id: 'color-47', color: ['floralwhite', 255, 250, 240] },
    'color-48': { id: 'color-48', color: ['forestgreen', 34, 139, 34] },
    'color-49': { id: 'color-49', color: ['fuchsia', 255, 0, 255] },
    'color-50': { id: 'color-50', color: ['gainsboro', 220, 220, 220] },
    'color-51': { id: 'color-51', color: ['ghostwhite', 248, 248, 255] },
    'color-52': { id: 'color-52', color: ['gold', 255, 215, 0] },
    'color-53': { id: 'color-53', color: ['goldenrod', 218, 165, 32] },
    'color-54': { id: 'color-54', color: ['gray', 128, 128, 128] },
    'color-55': { id: 'color-55', color: ['grey', 128, 128, 128] },
    'color-56': { id: 'color-56', color: ['green', 0, 128, 0] },
    'color-57': { id: 'color-57', color: ['greenyellow', 173, 255, 47] },
    'color-58': { id: 'color-58', color: ['honeydew', 240, 255, 240] },
    'color-59': { id: 'color-59', color: ['hotpink', 255, 105, 180] },
    'color-60': { id: 'color-60', color: ['indianred', 205, 92, 92] },
    'color-61': { id: 'color-61', color: ['indigo', 75, 0, 130] },
    'color-62': { id: 'color-62', color: ['ivory', 255, 255, 240] },
    'color-63': { id: 'color-63', color: ['khaki', 240, 230, 140] },
    'color-64': { id: 'color-64', color: ['lavender', 230, 230, 250] },
    'color-65': { id: 'color-65', color: ['lavenderblush', 255, 240, 245] },
    'color-66': { id: 'color-66', color: ['lawngreen', 124, 252, 0] },
    'color-67': { id: 'color-67', color: ['lemonchiffon', 255, 250, 205] },
    'color-68': { id: 'color-68', color: ['lightblue', 173, 216, 230] },
    'color-69': { id: 'color-69', color: ['lightcoral', 240, 128, 128] },
    'color-70': { id: 'color-70', color: ['lightcyan', 224, 255, 255] },
    'color-71': { id: 'color-71', color: ['lightgoldenrodyellow', 250, 250, 210] },
    'color-72': { id: 'color-72', color: ['lightgray', 211, 211, 211] },
    'color-73': { id: 'color-73', color: ['lightgreen', 144, 238, 144] },
    'color-74': { id: 'color-74', color: ['lightgrey', 211, 211, 211] },
    'color-75': { id: 'color-75', color: ['lightpink', 255, 182, 193] },
    'color-76': { id: 'color-76', color: ['lightsalmon', 255, 160, 122] },
    'color-77': { id: 'color-77', color: ['lightseagreen', 32, 178, 170] },
    'color-78': { id: 'color-78', color: ['lightskyblue', 135, 206, 250] },
    'color-79': { id: 'color-79', color: ['lightslategray', 119, 136, 153] },
    'color-80': { id: 'color-80', color: ['lightslategrey', 119, 136, 153] },
    'color-81': { id: 'color-81', color: ['lightsteelblue', 176, 196, 222] },
    'color-82': { id: 'color-82', color: ['lightyellow', 255, 255, 224] },
    'color-83': { id: 'color-83', color: ['lime', 0, 255, 0] },
    'color-84': { id: 'color-84', color: ['limegreen', 50, 205, 50] },
    'color-85': { id: 'color-85', color: ['linen', 250, 240, 230] },
    'color-86': { id: 'color-86', color: ['magenta', 255, 0, 255] },
    'color-87': { id: 'color-87', color: ['maroon', 128, 0, 0] },
    'color-88': { id: 'color-88', color: ['mediumaquamarine', 102, 205, 170] },
    'color-89': { id: 'color-89', color: ['mediumblue', 0, 0, 205] },
    'color-90': { id: 'color-90', color: ['mediumorchid', 186, 85, 211] },
    'color-91': { id: 'color-91', color: ['mediumpurple', 147, 112, 219] },
    'color-92': { id: 'color-92', color: ['mediumseagreen', 60, 179, 113] },
    'color-93': { id: 'color-93', color: ['mediumslateblue', 123, 104, 238] },
    'color-94': { id: 'color-94', color: ['mediumspringgreen', 0, 250, 154] },
    'color-95': { id: 'color-95', color: ['mediumturquoise', 72, 209, 204] },
    'color-96': { id: 'color-96', color: ['mediumvioletred', 199, 21, 133] },
    'color-97': { id: 'color-97', color: ['midnightblue', 25, 25, 112] },
    'color-98': { id: 'color-98', color: ['mintcream', 245, 255, 250] },
    'color-99': { id: 'color-99', color: ['mistyrose', 255, 228, 225] },
    'color-100': { id: 'color-100', color: ['moccasin', 255, 228, 181] },
    'color-101': { id: 'color-101', color: ['navajowhite', 255, 222, 173] },
    'color-102': { id: 'color-102', color: ['navy', 0, 0, 128] },
    'color-103': { id: 'color-103', color: ['oldlace', 253, 245, 230] },
    'color-104': { id: 'color-104', color: ['olive', 128, 128, 0] },
    'color-105': { id: 'color-105', color: ['olivedrab', 107, 142, 35] },
    'color-106': { id: 'color-106', color: ['orange', 255, 165, 0] },
    'color-107': { id: 'color-107', color: ['orangered', 255, 69, 0] },
    'color-108': { id: 'color-108', color: ['orchid', 218, 112, 214] },
    'color-109': { id: 'color-109', color: ['palegoldenrod', 238, 232, 170] },
    'color-110': { id: 'color-110', color: ['palegreen', 152, 251, 152] },
    'color-111': { id: 'color-111', color: ['paleturquoise', 175, 238, 238] },
    'color-112': { id: 'color-112', color: ['palevioletred', 219, 112, 147] },
    'color-113': { id: 'color-113', color: ['papayawhip', 255, 239, 213] },
    'color-114': { id: 'color-114', color: ['peachpuff', 255, 218, 185] },
    'color-115': { id: 'color-115', color: ['peru', 205, 133, 63] },
    'color-116': { id: 'color-116', color: ['pink', 255, 192, 203] },
    'color-117': { id: 'color-117', color: ['plum', 221, 160, 221] },
    'color-118': { id: 'color-118', color: ['powderblue', 176, 224, 230] },
    'color-119': { id: 'color-119', color: ['purple', 128, 0, 128] },
    'color-120': { id: 'color-120', color: ['red', 255, 0, 0] },
    'color-121': { id: 'color-121', color: ['rosybrown', 188, 143, 143] },
    'color-122': { id: 'color-122', color: ['royalblue', 65, 105, 225] },
    'color-123': { id: 'color-123', color: ['saddlebrown', 139, 69, 19] },
    'color-124': { id: 'color-124', color: ['salmon', 250, 128, 114] },
    'color-125': { id: 'color-125', color: ['sandybrown', 244, 164, 96] },
    'color-126': { id: 'color-126', color: ['seagreen', 46, 139, 87] },
    'color-127': { id: 'color-127', color: ['seashell', 255, 245, 238] },
    'color-128': { id: 'color-128', color: ['sienna', 160, 82, 45] },
    'color-129': { id: 'color-129', color: ['silver', 192, 192, 192] },
    'color-130': { id: 'color-130', color: ['skyblue', 135, 206, 235] },
    'color-131': { id: 'color-131', color: ['slateblue', 106, 90, 205] },
    'color-132': { id: 'color-132', color: ['slategray', 112, 128, 144] },
    'color-133': { id: 'color-133', color: ['slategrey', 112, 128, 144] },
    'color-134': { id: 'color-134', color: ['snow', 255, 250, 250] },
    'color-135': { id: 'color-135', color: ['springgreen', 0, 255, 127] },
    'color-136': { id: 'color-136', color: ['steelblue', 70, 130, 180] },
    'color-137': { id: 'color-137', color: ['tan', 210, 180, 140] },
    'color-138': { id: 'color-138', color: ['teal', 0, 128, 128] },
    'color-139': { id: 'color-139', color: ['thistle', 216, 191, 216] },
    'color-140': { id: 'color-140', color: ['tomato', 255, 99, 71] },
    'color-141': { id: 'color-141', color: ['turquoise', 64, 224, 208] },
    'color-142': { id: 'color-142', color: ['violet', 238, 130, 238] },
    'color-143': { id: 'color-143', color: ['wheat', 245, 222, 179] },
    'color-144': { id: 'color-144', color: ['white', 255, 255, 255] },
    'color-145': { id: 'color-145', color: ['whitesmoke', 245, 245, 245] },
    'color-146': { id: 'color-146', color: ['yellow', 255, 255, 0] },
    'color-147': { id: 'color-147', color: ['yellowgreen', 154, 205, 50] },
    'color-201': { id: 'color-201;, color: []' },
    'color-202': { id: 'color-202;, color: []' },
    'color-203': { id: 'color-203;, color: []' },
    'color-204': { id: 'color-204;, color: []' },
    'color-205': { id: 'color-205;, color: []' },
    'color-206': { id: 'color-206;, color: []' },
    'color-207': { id: 'color-207;, color: []' },
    'color-208': { id: 'color-208;, color: []' },
    'color-209': { id: 'color-209;, color: []' },
    'color-210': { id: 'color-210;, color: []' },
    'color-211': { id: 'color-211;, color: []' },
    'color-212': { id: 'color-212;, color: []' },
    'color-213': { id: 'color-213;, color: []' },
    'color-214': { id: 'color-214;, color: []' },
    'color-215': { id: 'color-215;, color: []' },
    'color-216': { id: 'color-216;, color: []' },
    'color-217': { id: 'color-217;, color: []' },
    'color-218': { id: 'color-218;, color: []' },
    'color-219': { id: 'color-219;, color: []' },
    'color-220': { id: 'color-220;, color: []' },
    'color-221': { id: 'color-221;, color: []' },
    'color-222': { id: 'color-222;, color: []' },
    'color-223': { id: 'color-223;, color: []' },
    'color-224': { id: 'color-224;, color: []' },
    'color-225': { id: 'color-225;, color: []' },
    'color-226': { id: 'color-226;, color: []' },
    'color-227': { id: 'color-227;, color: []' },
    'color-228': { id: 'color-228;, color: []' },
    'color-229': { id: 'color-229;, color: []' },
    'color-230': { id: 'color-230;, color: []' },
    'color-231': { id: 'color-231;, color: []' },
    'color-232': { id: 'color-232;, color: []' },
    'color-233': { id: 'color-233;, color: []' },
    'color-234': { id: 'color-234;, color: []' },
    'color-235': { id: 'color-235;, color: []' },
    'color-236': { id: 'color-236;, color: []' },
    'color-237': { id: 'color-237;, color: []' },
    'color-238': { id: 'color-238;, color: []' },
    'color-239': { id: 'color-239;, color: []' },
    'color-240': { id: 'color-240;, color: []' },
    'color-241': { id: 'color-241;, color: []' },
    'color-242': { id: 'color-242;, color: []' },
    'color-243': { id: 'color-243;, color: []' },
    'color-244': { id: 'color-244;, color: []' },
    'color-245': { id: 'color-245;, color: []' },
    'color-246': { id: 'color-246;, color: []' },
    'color-247': { id: 'color-247;, color: []' },
    'color-248': { id: 'color-248;, color: []' },
    'color-249': { id: 'color-249;, color: []' },
    'color-250': { id: 'color-250;, color: []' },
    'color-251': { id: 'color-251;, color: []' },
    'color-252': { id: 'color-252;, color: []' },
    'color-253': { id: 'color-253;, color: []' },
    'color-254': { id: 'color-254;, color: []' },
    'color-255': { id: 'color-255;, color: []' },
    'color-256': { id: 'color-256;, color: []' },
    'color-257': { id: 'color-257;, color: []' },
    'color-258': { id: 'color-258;, color: []' },
    'color-259': { id: 'color-259;, color: []' },
    'color-260': { id: 'color-260;, color: []' },
    'color-261': { id: 'color-261;, color: []' },
    'color-262': { id: 'color-262;, color: []' },
    'color-263': { id: 'color-263;, color: []' },
    'color-264': { id: 'color-264;, color: []' },
    'color-265': { id: 'color-265;, color: []' },
    'color-266': { id: 'color-266;, color: []' },
    'color-267': { id: 'color-267;, color: []' },
    'color-268': { id: 'color-268;, color: []' },
    'color-269': { id: 'color-269;, color: []' },
    'color-270': { id: 'color-270;, color: []' },
    'color-271': { id: 'color-271;, color: []' },
    'color-272': { id: 'color-272;, color: []' },
    'color-273': { id: 'color-273;, color: []' },
    'color-274': { id: 'color-274;, color: []' },
    'color-275': { id: 'color-275;, color: []' },
    'color-276': { id: 'color-276;, color: []' },
    'color-277': { id: 'color-277;, color: []' },
    'color-278': { id: 'color-278;, color: []' },
    'color-279': { id: 'color-279;, color: []' },
    'color-280': { id: 'color-280;, color: []' },
    'color-281': { id: 'color-281;, color: []' },
    'color-282': { id: 'color-282;, color: []' },
    'color-283': { id: 'color-283;, color: []' },
    'color-284': { id: 'color-284;, color: []' },
    'color-285': { id: 'color-285;, color: []' },
    'color-286': { id: 'color-286;, color: []' },
    'color-287': { id: 'color-287;, color: []' },
    'color-288': { id: 'color-288;, color: []' },
    'color-289': { id: 'color-289;, color: []' },
    'color-290': { id: 'color-290;, color: []' },
    'color-291': { id: 'color-291;, color: []' },
    'color-292': { id: 'color-292;, color: []' },
    'color-293': { id: 'color-293;, color: []' },
    'color-294': { id: 'color-294;, color: []' },
    'color-295': { id: 'color-295;, color: []' },
    'color-296': { id: 'color-296;, color: []' },
    'color-297': { id: 'color-297;, color: []' },
    'color-298': { id: 'color-298;, color: []' },
    'color-299': { id: 'color-299;, color: []' },
    'color-300': { id: 'color-300;, color: []' }
  },
  palettes: {
    'personal': {
      id: 'personal',
      title: 'Personal',
      colorIds: []
    },
    'main': { /* We use this for sorting - cannot wrap such a large palette and expect react-beautiful-dnd to work properly. */
      id: 'main',
      title: 'Main Palette',
      colorIds: ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8', 'color-9', 'color-10',
        'color-11', 'color-12', 'color-13', 'color-14', 'color-15', 'color-16', 'color-17', 'color-18', 'color-19', 'color-20',
        'color-21', 'color-22', 'color-23', 'color-24', 'color-25', 'color-26', 'color-27', 'color-28', 'color-29', 'color-30',
        'color-31', 'color-32', 'color-33', 'color-34', 'color-35', 'color-36', 'color-37', 'color-38', 'color-39', 'color-40',
        'color-41', 'color-42', 'color-43', 'color-44', 'color-45', 'color-46', 'color-47', 'color-48', 'color-49', 'color-50',
        'color-51', 'color-52', 'color-53', 'color-54', 'color-55', 'color-56', 'color-57', 'color-58', 'color-59', 'color-60',
        'color-61', 'color-62', 'color-63', 'color-64', 'color-65', 'color-66', 'color-67', 'color-68', 'color-69', 'color-70',
        'color-71', 'color-72', 'color-73', 'color-74', 'color-75', 'color-76', 'color-77', 'color-78', 'color-79', 'color-80',
        'color-81', 'color-82', 'color-83', 'color-84', 'color-85', 'color-86', 'color-87', 'color-88', 'color-89', 'color-90',
        'color-91', 'color-92', 'color-93', 'color-94', 'color-95', 'color-96', 'color-97', 'color-98', 'color-99', 'color-100',
        'color-101', 'color-102', 'color-103', 'color-104', 'color-105', 'color-106', 'color-107', 'color-108', 'color-109', 'color-110',
        'color-111', 'color-112', 'color-113', 'color-114', 'color-115', 'color-116', 'color-117', 'color-118', 'color-119', 'color-120',
        'color-121', 'color-122', 'color-123', 'color-124', 'color-125', 'color-126', 'color-127', 'color-128', 'color-129', 'color-130',
        'color-131', 'color-132', 'color-133', 'color-134', 'color-135', 'color-136', 'color-137', 'color-138', 'color-139', 'color-140',
        'color-141', 'color-142', 'color-143', 'color-144', 'color-145', 'color-146', 'color-147']
    },
    'random': { /* We use this for sorting - cannot wrap such a large palette and expect react-beautiful-dnd to work properly. */
      id: 'random',
      title: 'Random Palette',
      colorIds: ['color-201', 'color-202', 'color-203', 'color-204', 'color-205', 'color-206', 'color-207', 'color-208', 'color-209', 'color-210',
        'color-211', 'color-212', 'color-213', 'color-214', 'color-215', 'color-216', 'color-217', 'color-218', 'color-219', 'color-220',
        'color-221', 'color-222', 'color-223', 'color-224', 'color-225', 'color-226', 'color-227', 'color-228', 'color-229', 'color-230',
        'color-231', 'color-232', 'color-233', 'color-234', 'color-235', 'color-236', 'color-237', 'color-238', 'color-239', 'color-240',
        'color-241', 'color-242', 'color-243', 'color-244', 'color-245', 'color-246', 'color-247', 'color-248', 'color-249', 'color-250',
        'color-251', 'color-252', 'color-253', 'color-254', 'color-255', 'color-256', 'color-257', 'color-258', 'color-259', 'color-260',
        'color-261', 'color-262', 'color-263', 'color-264', 'color-265', 'color-266', 'color-267', 'color-268', 'color-269', 'color-270',
        'color-271', 'color-272', 'color-273', 'color-274', 'color-275', 'color-276', 'color-277', 'color-278', 'color-279', 'color-280',
        'color-281', 'color-282', 'color-283', 'color-284', 'color-285', 'color-286', 'color-287', 'color-288', 'color-289', 'color-290',
        'color-291', 'color-292', 'color-293', 'color-294', 'color-295', 'color-296', 'color-297', 'color-298', 'color-299', 'color-300']
    },
    'p1': {
      id: 'p1',
      title: 'Row 1',
      colorIds: ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7', 'color-8', 'color-9', 'color-10',]
    },
    'p2': {
      id: 'p2',
      title: 'Row 2',
      colorIds: ['color-11', 'color-12', 'color-13', 'color-14', 'color-15', 'color-16', 'color-17', 'color-18', 'color-19', 'color-20']
    },
    'p3': {
      id: 'p3',
      title: 'Row 3',
      colorIds: ['color-21', 'color-22', 'color-23', 'color-24', 'color-25', 'color-26', 'color-27', 'color-28', 'color-29', 'color-30']
    },
    'p4': {
      id: 'p4',
      title: 'Row 4',
      colorIds: ['color-31', 'color-32', 'color-33', 'color-34', 'color-35', 'color-36', 'color-37', 'color-38', 'color-39', 'color-40']
    },
    'p5': {
      id: 'p5',
      title: 'Row 5',
      colorIds: ['color-41', 'color-42', 'color-43', 'color-44', 'color-45', 'color-46', 'color-47', 'color-48', 'color-49', 'color-50']
    },
    'p6': {
      id: 'p6',
      title: 'Row 6',
      colorIds: ['color-51', 'color-52', 'color-53', 'color-54', 'color-55', 'color-56', 'color-57', 'color-58', 'color-59', 'color-60']
    },
    'p7': {
      id: 'p7',
      title: 'Row 7',
      colorIds: ['color-61', 'color-62', 'color-63', 'color-64', 'color-65', 'color-66', 'color-67', 'color-68', 'color-69', 'color-70']
    },
    'p8': {
      id: 'p8',
      title: 'Row 8',
      colorIds: ['color-71', 'color-72', 'color-73', 'color-74', 'color-75', 'color-76', 'color-77', 'color-78', 'color-79', 'color-80']
    },
    'p9': {
      id: 'p9',
      title: 'Row 9',
      colorIds: ['color-81', 'color-82', 'color-83', 'color-84', 'color-85', 'color-86', 'color-87', 'color-88', 'color-89', 'color-90']
    },
    'p10': {
      id: 'p10',
      title: 'Row 10',
      colorIds: ['color-91', 'color-92', 'color-93', 'color-94', 'color-95', 'color-96', 'color-97', 'color-98', 'color-99', 'color-100']
    },
    'p11': {
      id: 'p11',
      title: 'Row 11',
      colorIds: ['color-101', 'color-102', 'color-103', 'color-104', 'color-105', 'color-106', 'color-107', 'color-108', 'color-109', 'color-110']
    },
    'p12': {
      id: 'p12',
      title: 'Row 12',
      colorIds: ['color-111', 'color-112', 'color-113', 'color-114', 'color-115', 'color-116', 'color-117', 'color-118', 'color-119', 'color-120']
    },
    'p13': {
      id: 'p13',
      title: 'Row 13',
      colorIds: ['color-121', 'color-122', 'color-123', 'color-124', 'color-125', 'color-126', 'color-127', 'color-128', 'color-129', 'color-130']
    },
    'p14': {
      id: 'p14',
      title: 'Row 14',
      colorIds: ['color-131', 'color-132', 'color-133', 'color-134', 'color-135', 'color-136', 'color-137', 'color-138', 'color-139', 'color-140']
    },
    'p15': {
      id: 'p15',
      title: 'Row 15',
      colorIds: ['color-141', 'color-142', 'color-143', 'color-144', 'color-145', 'color-146', 'color-147']
    },
    'p16': { // these may be fllled for sort by color.
      id: 'p16',
      title: 'Row 16',
      colorIds: []
    },
    'p17': {
      id: 'p17',
      title: 'Row 17',
      colorIds: []
    },
    'p18': {
      id: 'p18',
      title: 'Row 18',
      colorIds: []
    },
    'p19': {
      id: 'p19',
      title: 'Row 19',
      colorIds: []
    },
    'p20': {
      id: 'p20',
      title: 'Row 20',
      colorIds: []
    },
    'p21': {
      id: 'p21',
      title: 'Row 21',
      colorIds: []
    },
    'p201': {
      id: 'p201',
      title: 'Row 201',
      colorIds: ['color-201', 'color-202', 'color-203', 'color-204', 'color-205', 'color-206', 'color-207', 'color-208', 'color-209', 'color-210',]
    },
    'p202': {
      id: 'p202',
      title: 'Row 202',
      colorIds: ['color-211', 'color-212', 'color-213', 'color-214', 'color-215', 'color-216', 'color-217', 'color-218', 'color-219', 'color-220']
    },
    'p203': {
      id: 'p203',
      title: 'Row 203',
      colorIds: ['color-221', 'color-222', 'color-223', 'color-224', 'color-225', 'color-226', 'color-227', 'color-228', 'color-229', 'color-230']
    },
    'p204': {
      id: 'p204',
      title: 'Row 204',
      colorIds: ['color-231', 'color-232', 'color-233', 'color-234', 'color-235', 'color-236', 'color-237', 'color-238', 'color-239', 'color-240']
    },
    'p205': {
      id: 'p205',
      title: 'Row 205',
      colorIds: ['color-241', 'color-242', 'color-243', 'color-244', 'color-245', 'color-246', 'color-247', 'color-248', 'color-249', 'color-250']
    },
    'p206': {
      id: 'p206',
      title: 'Row 206',
      colorIds: ['color-251', 'color-252', 'color-253', 'color-254', 'color-255', 'color-256', 'color-257', 'color-258', 'color-259', 'color-260']
    },
    'p207': {
      id: 'p207',
      title: 'Row 207',
      colorIds: ['color-261', 'color-262', 'color-263', 'color-264', 'color-265', 'color-266', 'color-267', 'color-268', 'color-269', 'color-270']
    },
    'p208': {
      id: 'p208',
      title: 'Row 208',
      colorIds: ['color-271', 'color-272', 'color-273', 'color-274', 'color-275', 'color-276', 'color-277', 'color-278', 'color-279', 'color-280']
    },
    'p209': {
      id: 'p209',
      title: 'Row 209',
      colorIds: ['color-281', 'color-282', 'color-283', 'color-284', 'color-285', 'color-286', 'color-287', 'color-288', 'color-289', 'color-290']
    },
    'p210': {
      id: 'p210',
      title: 'Row 210',
      colorIds: ['color-291', 'color-292', 'color-293', 'color-294', 'color-295', 'color-296', 'color-297', 'color-298', 'color-299', 'color-300']
    },
  },
  // Facilitate reordering of the columns.
  // 'personal' is not included because it always appears at the top.
  // 'main' is not included because it is only used for sorting.
  paletteOrder: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15'],
};

export default initialData;