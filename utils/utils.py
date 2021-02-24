#!/usr/bin/env python
# coding: utf-8

import os, sys

import pymongo as pm
import numpy as np
import scipy.stats as stats
import pandas as pd
import json
import re
from io import BytesIO
from PIL import Image
import requests # this is to access the stim urls
from skimage import io, img_as_float
import base64

import matplotlib
from matplotlib import pylab, mlab, pyplot
from IPython.core.pylabtools import figsize, getfigs
plt = pyplot
import seaborn as sns
sns.set_context('talk')
sns.set_style('white')

from IPython.display import clear_output
import importlib

import warnings
    
from glob import glob
import os, sys
import numpy as np
import re

try:
    from bezier import curve
    from svg.path import Path, Line, Arc, CubicBezier, QuadraticBezier, Close, parse_path
except:
    print('Something went wrong while trying to import bezier and svg modules, sorry!')
    pass
    
def list_files(path, ext='png'):
    result = [y for x in os.walk(path) for y in glob(os.path.join(x[0], '*.%s' % ext))]
    return result

def tryint(s):
    try:
        return int(s)
    except ValueError:
        return s
     
def alphanum_key(s):
    """ Turn a string into a list of string and number chunks.
        "z23a" -> ["z", 23, "a"]
    """
    return [ tryint(c) for c in re.split('([0-9]+)', s) ]

def sort_nicely(l):
    """ Sort the given list in the way that humans expect.
    """
    l.sort(key=alphanum_key)    

def render_images(D, 
                 data = 'pngData',
                 metadata = ['trialNum'],
                 out_dir = './sketches',
                 targ_dir = './targs',
                 delimiter = '_',
                 overwrite = True,
                 clear = True,
                 savetargs = False): # savetargs will expect the last metadata to be part of the target image url
    '''
    input: dataframe D containing png data (see data keyword argument)
           and list of metadata attributes (see metadata keyword argument)
           out_dir = which directory to save the pngs to
           delimiter = when constructing each filename, what character to stick in between each attribute
    output: return list of PIL Images;
            saves images out as PNG files to out_path 
            where each filename is constructed from concatenating metadata attributes
    '''
    for i,d in D.iterrows():         
        # convert pngData string into a PIL Image object
        im = Image.open(BytesIO(base64.b64decode(d[data])))

        # construct the filename by concatenating attributes
        attributes = [str(d[attr]) for  attr in metadata]
        name = delimiter.join(attributes)        
        name = name.split(delimiter)
        fname = name[0] + delimiter + name[1] + delimiter + str(int(name[2])+1) + delimiter + name[3] + delimiter + name[4] + delimiter + name[7]#.split('.')[0]
        
        # create the out_dir if it does not already exist
        if not os.path.exists(out_dir): 
            os.makedirs(out_dir)
        
        if savetargs == True:
            # create the targ_dir if it does not already exist
            if not os.path.exists(targ_dir): 
                os.makedirs(targ_dir)
            
        # now save the image out to that directory
        if (overwrite or not os.path.exists(os.path.join(out_dir,fname))):  # used to have +'.png' after fname
            print('Currently rendering {} | {} of {}'.format(d['trialNum'],i+1,D.shape[0])) 
            im.save(os.path.join(out_dir,fname),'PNG')  # used to have +'.png' after fname
            
            if savetargs == True:
                url = 'https://iternum.s3.amazonaws.com/' + attributes[-1]
                response = requests.get(url)
                targ = Image.open(BytesIO(response.content))
                targ.save(os.path.join(targ_dir,fname),'PNG') # used to have +'.png' after fname
        else:
            print('Skipping {} | {} of {}'.format(d['trialNum'],i+1,D.shape[0])) 
        if clear:
            clear_output(wait=True) 
    
    print('Done rendering {} images to {}.'.format(D.shape[0],out_dir))
    
def row_based_idx(num_rows, num_cols, idx):
#     print(type(num_rows),'\n',
#           type(num_cols),'\n',
#           type(idx),'\n',
#           type(np.arange(1, num_rows*num_cols + 1)[0]))
    return np.arange(1, int(num_rows)*int(num_cols) + 1).reshape((int(num_rows), int(num_cols))).transpose().flatten()[idx-1]

def render_sketch_gallery(gameids,
                          df,
                          sketch_dir = './sketches',
                          gallery_dir = './gallery',
                          num_trials = 32,
                          by_trialnum = False,
                          show_correct = False,
                          transpose=False,
                          delimiter = '_'):
    '''
    input: 
         gameids: list of gameids
         df: dataframe: putting this in so we can visualize more about each trial
         sketch_dir: full path to dir containing rendered PNG sketch files (data source)
         gallery_dir: full path to dir where you want to save gallery image out (data destination)
         num_trials: how many trials per game? used to determine subplot arrangement
         by_trialnum: do we want this plotted so we can see chronological order?
         show_correct: put a green [red] background on correct [incorrect] trials
    '''
    sketch_paths = sorted([sketch_path for sketch_path in os.listdir(sketch_dir)])

    ## make guess about how many rows and columns to use
    nrows = 4
    ncols = num_trials / nrows if num_trials%nrows==0 else int(np.ceil(num_trials/nrows))
    
    if transpose == True:
        ## make a different guess if we want to visualize the results in chronological order
        # 1 for each of the current number of blocks in the experiment
        ncols = 4
        nrows = num_trials / ncols if num_trials%ncols==0 else int(np.ceil(num_trials/ncols))
    
    ## generate gallery for each participant
    for gind, game in enumerate(gameids): 
        print('Generating sketch gallery for participant: {} | {} of {}'.format(game,gind+1,len(gameids)))
        # get list of all sketch paths JUST from current game
        game_sketch_paths = [path for path in sketch_paths if path.split(delimiter)[0] == game]
        if by_trialnum == True:
            # get the same list, but re-ordered by trial number
            trial_ordering = []
            for trial_i in np.arange(len(game_sketch_paths)):
                trial_ordering.append([path for path in game_sketch_paths if int(path.split(delimiter)[3]) == trial_i+1][0])
                
                
                
                
                ### Sebastian has to redo this whole mess because of changing the sketch metadata. FIO later (7/Aug/2020)
                
                
                
                
                
                
                
                
                
                
            
            game_sketch_paths = trial_ordering
            
        fig = plt.figure(figsize=(24,12))
        if transpose == True:
            fig = plt.figure(figsize=(12,24))
        for i,f in enumerate(game_sketch_paths):
            # open image
            im = Image.open(os.path.join(sketch_dir,f))
            # get metadata
            gameid = f.split(delimiter)[0] 
            category = f.split(delimiter)[1]
            cardinality = str(int(f.split(delimiter)[2]) + 1)
            trialNum = f.split(delimiter)[3].split('.')[0]
            
            # make gallery
            plot_ind = i+1
            if transpose == True:
                plot_ind = row_based_idx(nrows,ncols,i+1)
            p = plt.subplot(nrows,ncols,plot_ind)
            plt.imshow(im)
            colour = 'white'
            if show_correct == True:
                correct = df.loc[df['gameID']==gameid].loc[df['trialNum']==i+1]['outcome'].values[0]
                title_colour = '#067D1A' if correct == 1 else '#AF180E'
                
            sns.set_style(colour)
            k = p.get_xaxis().set_ticklabels([])
            k = p.get_yaxis().set_ticklabels([])
            k = p.get_xaxis().set_ticks([])
            k = p.get_yaxis().set_ticks([])   
            p.axis('off')
            plt.title('#{}, {} {}'.format(trialNum,category,cardinality))
            title_obj = plt.title('#{}, {} {}'.format(trialNum,category,cardinality))
            plt.setp(title_obj, color=title_colour)
            
        f = game_sketch_paths[1] # had to make this up; every game only has one condition, so okay for now
        game_condition = f.split(delimiter)[4].split('.')[0] # this used to be indented, but it's only useful unindented....
        
        suptitle = game_condition + delimiter + gameid
        plt.suptitle(suptitle)
        fname = '{}.png'.format(suptitle)
        plt.savefig(os.path.join(gallery_dir,fname))
        plt.close(fig)
    print('Done!')    
    
def GetArcLenData(df):
    """
    Thought having this measure might be helpful for naive quantitative analyses.
    
    This function requires the dataframe to have a ['svgString'] column to analyse.
    It returns the same dataframe, but with an extra column of 'stroke_len_means'.
    Currently just taking the total arc length of each stroke, and averaging them per sketch.
    
    If not already done, import Path, Arc, CubicBezier, and parse_path from svg.path
    Used this: https://pypi.org/project/svg.path/
    """
    stroke_len_means = []
    for row_num in range(len(df['svgString'])):
        stroke_lengths = []
        for stroke_num in range(len(df['svgString'][row_num])):
            stroke_length = 0
            for curve in parse_path(D['svgString'][row_num][stroke_num]):
                stroke_length += curve.length(error=1e-5)
            stroke_lengths.append(stroke_length)
        stroke_len_means.append(np.mean(stroke_lengths))
    new_df = df
    new_df['stroke_len_means'] = stroke_len_means
    return new_df
    
    
def generate_dataframe(coll, complete_games, iterationName, csv_dir):
    
    # preprocessing
    TrialNum = []
    GameID = []
    Condition = []
    Target = []
    Category = []
    Cardinality = []
    Game_Condition = []
    Targ_s_Url = []
    Targ_v_Url = []
    Dis_s_Urls = []
    Dis_v_Urls = []
    D1 = [] # Distractor 1. Abbreviating it
    D1_Cat = [] # category
    D1_Car = [] # cardinality
    D2 = []
    D2_Cat = []
    D2_Car = []
    D3 = []
    D3_Cat = []
    D3_Car = []
    Outcome = []
    Response = []
    Repetition = []
    Phase = []
    numStrokes = []
    drawDuration = [] # in seconds
    svgString = [] # svg string representation of ksetch
    numCurvesPerSketch = [] # number of curve segments per sketch
    numCurvesPerStroke = [] # mean number of curve segments per stroke
    svgStringStd = [] # std of svg string length across strokes for this sketch
    Outcome = [] #accuracy (True or False)
    png=[] # the sketch
    timedOut=[] # True if sketchers didn't draw anything, False o.w.
    meanPixelIntensity=[]


    for i,g in enumerate(complete_games):

            # collection of all clickedObj events in a particular game
            X = coll.find({ '$and': [{'gameid': g}, {'eventType': 'clickedObj'}]}).sort('time')
            # collection of all stroke events in a particular game
            Y = coll.find({ '$and': [{'gameid': g}, {'eventType': 'stroke'}]}).sort('time')
            counter = 0
            for t in X: # for each clickedObj event
                print( 'Analyzing game {} | {} of {} | trial {}'.format(g, i+1, len(complete_games),counter))
                clear_output(wait=True)                                
                counter += 1
                game_condition = t['game_condition']
                targ_s_url = t['targ_s_url']
                targ_v_url = t['targ_v_url']
                dis_s_urls = t['dis_s_urls']
                dis_v_urls = t['dis_v_urls']
                target = t['intendedName']
                category = target.split('_')[0]
                cardinality = target.split('_')[1]                
                distractors = [t['object1Name'],t['object2Name'],t['object3Name']]
                distractor_cats = [distractors[0].split('_')[0],distractors[1].split('_')[0],distractors[2].split('_')[0]]
                distractor_cars = [distractors[0].split('_')[1],distractors[1].split('_')[1],distractors[2].split('_')[1]]
                full_list = [t['intendedName'],t['object1Name'],t['object2Name'],t['object3Name']]
                png.append(t['pngString'])

                #for each stroke event with same trial number as this particular clickedObj event
                y = coll.find({ '$and': [{'gameid': g}, {'eventType': 'stroke'}, {'trialNum': t['trialNum']}]}).sort('time')
                # have to account for cases in which sketchers do not draw anything
                if (y.count() == 0):
                    numStrokes.append(float('NaN'))
                    drawDuration.append(float('NaN'))
                    #svgString.append('NaN')
                    numCurvesPerSketch.append(float('NaN'))
                    numCurvesPerStroke.append(float('NaN'))
                    meanPixelIntensity.append('NaN')
                    timedOut.append(True)
                    
                    svg_list = 'NaN'
                else:
                    y = coll.find({ '$and': [{'gameid': g}, {'eventType': 'stroke'}, {'trialNum': t['trialNum']}]}).sort('time')


                    lastStrokeNum = float(y[y.count() - 1]['currStrokeNum']) # get currStrokeNum at last stroke
                    ns = y.count()
                    if not lastStrokeNum == ns:
                        print("ns: " + str(ns))
                        print("lastStrokeNum: " + str(lastStrokeNum))

                    numStrokes.append(lastStrokeNum)

                    # calculate drawDuration
                    startStrokeTime =  float(y[0]['startStrokeTime'])
                    endStrokeTime = float(y[y.count() - 1]['endStrokeTime']) ## took out negative 1
                    duration = (endStrokeTime - startStrokeTime) / 1000
                    drawDuration.append(duration)

                    # extract svg string into list
                    svg_list = [_y['svgData'] for _y in y]

                    # calculate other measures that have to do with sketch
                    y = coll.find({ '$and': [{'gameid': g}, {'eventType': 'stroke'}, {'trialNum': t['trialNum']}]}).sort('time')
                    num_curves = [len([m.start() for m in re.finditer('c',str(_y['svgData']))]) for _y in y] ## gotcha: need to call string on _y['svgData'], o/w its unicode and re cant do anything with it
                    numCurvesPerSketch.append(sum(num_curves))
                    numCurvesPerStroke.append(sum(num_curves)/lastStrokeNum)
                    timedOut.append(False)

                    ## calculate pixel intensity (amount of ink spilled)                    
                    imsize = 300
                    numpix = imsize**2
                    thresh = 250
                    imgData = t['pngString']
                    im = Image.open(BytesIO(base64.b64decode(imgData)))
                    _im = np.array(im)
                    meanPixelIntensity.append(len(np.where(_im[:,:,3].flatten()>thresh)[0])/numpix)
                  

                ### aggregate game metadata
                TrialNum.append(t['trialNum'])
                GameID.append(t['gameid'])
                Target.append(target)
                Category.append(category)
                Cardinality.append(cardinality)
                Game_Condition.append(game_condition)
                Targ_s_Url.append(targ_s_url)
                Targ_v_Url.append(targ_v_url)
                Dis_s_Urls.append(dis_s_urls)
                Dis_v_Urls.append(dis_v_urls)
                Response.append(t['clickedName'])
                Outcome.append(t['correct'])
                D1.append(distractors[0])
                D1_Cat.append(distractor_cats[0])
                D1_Car.append(distractor_cars[0])
                D2.append(distractors[1])
                D2_Cat.append(distractor_cats[1])
                D2_Car.append(distractor_cars[1])
                D3.append(distractors[2])
                D3_Cat.append(distractor_cats[2])
                D3_Car.append(distractor_cars[2])
                svgString.append(svg_list)



    ## now actually make dataframe
    GameID,TrialNum, Target, Category, Cardinality, drawDuration, Outcome, Response, numStrokes, meanPixelIntensity, numCurvesPerSketch, numCurvesPerStroke, timedOut, png, svgString, D1, D1_Cat, D1_Car, D2, D2_Cat, D2_Car, D3, D3_Cat, D3_Car, Game_Condition, Targ_s_Url, Targ_v_Url, Dis_s_Urls, Dis_v_Urls = map(np.array, \
    [GameID,TrialNum, Target, Category, Cardinality, drawDuration, Outcome, Response, numStrokes, meanPixelIntensity, numCurvesPerSketch, numCurvesPerStroke, timedOut,png, svgString, D1, D1_Cat, D1_Car, D2, D2_Cat, D2_Car, D3, D3_Cat, D3_Car, Game_Condition, Targ_s_Url, Targ_v_Url, Dis_s_Urls, Dis_v_Urls])

    Repetition = map(int,Repetition)

    _D = pd.DataFrame([GameID,TrialNum, Target, Category, Cardinality, drawDuration, Outcome, Response, numStrokes, meanPixelIntensity, numCurvesPerSketch, numCurvesPerStroke, timedOut, png, svgString, D1, D1_Cat, D1_Car, D2, D2_Cat, D2_Car, D3, D3_Cat, D3_Car, Game_Condition, Targ_s_Url, Targ_v_Url, Dis_s_Urls, Dis_v_Urls],
                     index = ['gameID','trialNum', 'target', 'category', 'cardinality', 'drawDuration', 'outcome', 'response', 'numStrokes', 'meanPixelIntensity', 'numCurvesPerSketch', 'numCurvesPerStroke', 'timedOut', 'png','svgString', 'D1', 'D1_Cat', 'D1_Car', 'D2', 'D2_Cat', 'D2_Car', 'D3', 'D3_Cat', 'D3_Car', 'Game_Condition', 'Targ_s_Url', 'Targ_v_Url', 'Dis_s_Urls', 'Dis_v_Urls'])
    _D = _D.transpose()    
    
    # tag outlier games (low accuracy)
    _D['outcome'] = pd.to_numeric(_D['outcome'])
    acc = _D.groupby('gameID')['outcome'].mean().reset_index()
    thresh = acc['outcome'].mean() - acc['outcome'].std()*3
    low_acc_games = acc[acc['outcome']<thresh]['gameID'].values

    # add new column, low_acc, to keep track of low accuracy games
    _D = _D.assign(low_acc = pd.Series(np.zeros(len(_D),dtype=bool)))
    _D.loc[_D['gameID'].isin(low_acc_games),'low_acc'] = True

    # save out dataframe to be able to load in and analyze later w/o doing the above mongo querying ...
    _D.to_csv(os.path.join(csv_dir,'iterated_number_group_data_{}.csv'.format(iterationName)),index=False)

    print('Done!')
    return _D    
    
