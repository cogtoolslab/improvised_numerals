# need for running lmer
library(lme4)

# import the data that was output from internum_analysis.ipynb
dat = read.csv("all_data.csv", header = TRUE)

# for each DV (total ink, number of strokes, and draw duration) store the lmer
ink_lmer <- lmer(data = dat,
                 meanPixelIntensity ~ cardinality * category * Game_Condition * quarter
                 + (1+cardinality*category| gameID))

str_lmer <- lmer(data = dat,
                 numStrokes ~ cardinality * category * Game_Condition * quarter
                 + (1+cardinality*category| gameID))

dur_lmer <- lmer(data = dat,
                 drawDuration ~ cardinality * category * Game_Condition * quarter
                 + (1+cardinality*category| gameID))

ac_glmer <- glmer(data=dat,
                  outcome ~ cardinality * category * Game_Condition * quarter
                  + (1 + cardinality*category | gameID),
                  family = 'binomial')


