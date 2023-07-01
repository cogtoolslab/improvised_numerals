
#### Libraries ########
library('tidyverse')
library('ggplot2')
library('lme4')
library('lmerTest')
library('emmeans')
library('data.table')

################


#### Import Data ########
D1 <- read_csv("../results/csv/exp1_dyad.csv")
D2 <- read_csv("../results/csv/exp1_recog.csv")
D3 <- read_csv("../results/csv/exp2_dyad.csv")
D3e <- read_csv("../results/csv/exp2_dyad_excl.csv")
D4 <- read_csv("../results/csv/exp3_dyad.csv")

################


#### Some reformatting ########
D2 <- D2[!is.na(D2$block),] # excludes catch trials?

################


#### Experiment 1.0 ########
e1_acc <- glmer(data=D1,
                outcome ~ Game_Condition + cardinality + category + block 
                + (1 | gameID), family = 'binomial')

e1_time <- lmer(data=D1,
                drawDuration ~ Game_Condition * cardinality + category + block 
                + (1 + cardinality | gameID))

e1_stroke <- lmer(data=D1,
                  numStrokes ~ Game_Condition * cardinality + category*Game_Condition + block
                  + (1 + cardinality | gameID))

e1_ink <- lmer(data=D1,
                  meanPixelIntensity ~ Game_Condition + cardinality + category + block 
                  + (1 + cardinality | gameID))

# Let's also see if shape is an important component of the model. Do number as well
e1_acc_noShape  <- glmer(data=D1, outcome ~ Game_Condition + cardinality + block
                         + (1 | gameID), family = 'binomial')

e1_acc_noNumber <- glmer(data=D1, outcome ~ Game_Condition + category + block
                         + (1 | gameID), family = 'binomial')

anova(e1_acc,e1_acc_noNumber)
anova(e1_acc,e1_acc_noShape)

################


#### Experiment 1.1 ########
e1_recog <- glmer(data=D2, correct ~ 
                   Ocond * Rcond + block
                 + (1  | workerID) + (1  | OgameID) + (1|cardinality) + (1|shape),
                 family = 'binomial')

################


#### Experiment 2 ########
e2_acc <- glmer(data=D3,
                outcome ~ category + cardinality * Regularity + block 
                + (1 | gameID), family = 'binomial')

e2_PT <- lmer(data=D3,
                 drawDuration ~ category + cardinality + Regularity + block 
                 + (1 | gameID))

e2_RT <- lmer(data=D3,
                 vRT ~ category + cardinality * Regularity + block 
                 + (1 | gameID))


e2_stroke <- lmer(data=D3,
                     ratio ~ category + cardinality + Regularity + block 
                     + (1 | gameID))

## Check whether results pattern similarly when excluding flagged games
e2_PTe <- lmer(data=D3e,
              drawDuration ~ category + cardinality + Regularity + block 
              + (1 | gameID))

e2_acce <- glmer(data=D3e,
                outcome ~ category + cardinality * Regularity + block 
                + (1 | gameID), family = 'binomial')

e2_RTe <- lmer(data=D3e,
               vRT ~ category + cardinality * Regularity + block 
               + (1 | gameID))

e2_strokee <- lmer(data=D3e,
                  ratio ~ category + cardinality + Regularity + block 
                  + (1 | gameID))

################


#### Experiment 3 ########
e3_acc <- glmer(data=D4,
                correct ~ cardinality + trialNum +
                  (1 | gameID), family = 'binomial')

e3_PT <- lmer(data=D4,
                 PT ~ cardinality * trialNum +
                   (1 | gameID))

e3_RT <- lmer(data=D4,
                 RT ~ cardinality * trialNum +
                   (1 | gameID))

e3_token <- lmer(data=D4,
                    tokenRatio ~ cardinality * trialNum +
                      (1 | gameID))

## Does compressing one's message help the receiver guess correctly?
e3_p1 <- glmer(data=D4,
               correct ~ tokenRatio * cardinality +
                 (1 | gameID), family = 'binomial')

################


