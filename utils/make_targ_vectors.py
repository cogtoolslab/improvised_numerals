import numpy as np
from PIL import Image

from glob import glob
import os, sys
import re


# os.path.join(one_dir,im_name)

path = '/Users/alles/iterated_number/sketches'    # to get stims: '/Users/alles/iterated_number/analysis/targs/'
out_dir = '/Users/alles/iterated_number/features'
    
def list_files(path, ext='png'):
    result = [y for x in os.walk(path) for y in glob(os.path.join(x[0], '*.%s' % ext))]
    return result

imsize = 64 # how big do we want our images to be? Make small so the feature analysis doesn't take forever

all_files = list_files(path)

targs = np.zeros((0,imsize*imsize))

for file in all_files:
    targ = np.asarray(Image.open(file).resize((imsize,imsize)))[:,:,3].flatten()[np.newaxis] # [:,:,3] should be [:,:,0] if stims
    targs = np.append(targs, targ, axis=0)

np.save(os.path.join(out_dir,'FEATURES_IMG_{}.npy'.format(imsize)), targs)