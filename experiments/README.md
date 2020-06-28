# Communication task


##### 1.1 `iterationName` : `run3` through to `run6`
Date: 2020 May 4; May 5; May 8; May 19; May 20
- N = 60
- Summary of major changes to experimental design since version 1.1 (`run2`)
 - To address the 30 minute HIT endings, we're extending the HIT time to 40 (and see what happens)
 - May 8 put the time limit back to 30 minutes
 - There are so many different runs because Sebastian thought that we were supposed to change the run number every time I changed M-Turk HIT parameters / dispatched the HIT


##### 1.1 `iterationName` : `run2`
Date: 2020 April 28
- N = 7 games
- Summary of major changes to experimental design since version 1.0 (`run1`)
 - Started saving version urls of every stim that gets displayed to viewer or sketcher throughout each game
- Problem: still noticing that people's HITs in progress are suddenly being abandoned right around 30 minutes. This may have something to do with our mturk settings


##### 1.0 `iterationName` : `run1`
Date: 2020 April 23
- N = 1 games
- Summary of major changes to experimental design since version 0.9 (`livetest0`)
 - Finally set it so that sketcher and viewer see different versions of the stimuli (and are instructed about that at the beginning)
 - Added another animal (owls), for a total of 4 animals x 8 cardinalities. Now 32 trials per game
 - Because 8 is conveniently divisible by 4, randomization now happens such that successive windows of 4 contain each animal, of 8 each cardinality, exhausting the whole stim set after 32 trials
 - Distractors are now drawn such that they match the target in non-selected feature, and vary in the selected feature. This is a stronger constraint than livetest0
 - Having game_condition also generated at random and stored ('shape' or 'number')
 
 
 

##### 0.9 `iterationName` : `livetest0`
Date: 2020 April 3
- N = 3 (6 subjects: 2 per game for 3 games)
- Basic summary of experimental design:
    - The stimuli set made by crossing two features, cardinality (ranging from 1:8) and animal type (3 types: deer, bears, owls), for a total of 24 images ("3 owls", "8 bears", etc).
    - For every round, the target image (out of 4 images presented to the subjects) was selected by randomly drawing from the stimulus set without replacement (for a total of 24 trials), under the additional condition that every cardinality should appear once in each third of the experiment (i.e. draw without replacement from {1:8} 3 times in a row).
    - The distractors for each trial were drawn according to the sole condition that they not have the same cardinality as the target
    - Overall context (the kinds of cardinalities and types of animals subjects have seen so far in the experiment) was not specifically manipulated.

Plans for future iterations (to get what we want):
    - Change the stimuli so that rather than see the exact same images, the sketcher and viewer are shown different constellations (i.e. same number of same animal per image, but scattered differently on the background) and sketcher can therefore not rely on the constellation of animals on the image while constructing their message.
    - Feature larger cardinalities? Shorten the sketcher's time limit? (Because, it seems that drawing 8 circles is easily achieved in the 30 seconds we allow, making abbreviated representation unlikely to arise; but that's what we're interested in).
    - Introduce an 'animal group' of subjects (as opposed to the 'cardinality group). For games in the animal group, draw distractors according to the rule that they might share the cardinality with the target, but are never the same animal (think about how chance means something different for cardinality than for animal type, given that it's 3x8, and how to account for that). This will provide a control group where cardinality info is not selected for by the distractor set.

Plans for future iterations (tentative; to test new ideas):
    - Manipulate 'overall context' so that for the first half of the experiment, subjects only see cardinalities above (a) or below (b)some N, and only in the second half are shown cardinalities including below or above N, respectively, to elicit extensions of whatever conventions have been developed (and to either inhibit (a) or catalyze (b) the development of a base system)
