# need for running lmer
library(lme4)
library(tidyverse)
library(coda)
library(languageR)
library(lmerTest)    #need this for lmer p values!!! Maybe it's not so important...
library(emmeans)


# import the data that was output from internum_analysis.ipynb
dat = read.csv("all_data.csv", header = TRUE)
dat_num = filter(dat,Game_Condition == 'number')
dat_aml = filter(dat,Game_Condition == 'shape')



# start with some simple linear models (fixed effects)
lm_ink <- lm(data=dat,
             meanPixelIntensity ~ cardinality * category * Game_Condition * quarter)

lm_str <- lm(data=dat,
             numStrokes ~ cardinality * category * Game_Condition * quarter)

lm_dur <- lm(data=dat,
             drawDuration ~ cardinality * category * Game_Condition * quarter)

# for each DV (total ink, number of strokes, and draw duration) store the lmer
lmer_ink <- lmer(data = dat,
                 meanPixelIntensity ~ cardinality * category * Game_Condition * quarter
                 + (1 | gameID))

lmer_str <- lmer(data = dat,
                 numStrokes ~ cardinality * category * Game_Condition * quarter
                 + (1 | gameID))

lmer_dur <- lmer(data = dat,
                 drawDuration ~ cardinality * category * Game_Condition * quarter
                 + (1 | gameID))

glmer_ac <- glmer(data=dat,
                  outcome ~ cardinality * category * Game_Condition * quarter
                  + (1 | gameID),
                  family = 'binomial')

car::Anova(lmer_str)
emmeans::emmeans(lmer_str,list(pairwise~'category'),adjust='tukey')

anova(lm_ink)
anova(lm_str)
anova(lm_dur)
summary(lm_ink)
summary(lm_str)
summary(lm_dur)

anova(lmer_ink)
anova(lmer_str)
anova(lmer_dur)
summary(lmer_ink)
summary(lmer_str)
summary(lmer_dur)



# odd that the sum of variance in Random effects from the summary of lmer_dur is 15.34 (6.7 residuals)
# but then for the summary of a lmer with dur including cardinality*category in random,
# the total variance is about 18 (8 of which is residuals)




ik_interac_num <- lm(data=dat, meanPixelIntensity ~ cardinality * Game_Condition)#:cardinality)
anova(ik_interac_num)
# summary(ik_interac_num)
ik_interac_aml <- lm(data=dat, meanPixelIntensity ~ category * Game_Condition)#:cardinality)
anova(ik_interac_aml)
# summary(ik_interac_aml)


st_interac_num_BLOCK <- lm(data=dat, numStrokes ~ cardinality * Game_Condition * quarter)#:cardinality)
anova(st_interac_num_BLOCK)
summary(st_interac_num_BLOCK)
st_interac_aml_BLOCK <- lm(data=dat, numStrokes ~ category * Game_Condition * quarter)#:cardinality)
anova(st_interac_aml_BLOCK)
# summary(st_interac_aml_BLOCK)




st_interac_num <- lm(data=dat, numStrokes ~ cardinality * Game_Condition)#:cardinality)
anova(st_interac_num)
# summary(st_interac_num)
st_interac_aml <- lm(data=dat, numStrokes ~ category * Game_Condition)#:cardinality)
anova(st_interac_aml)
# summary(st_interac_aml)

dr_interac_num <- lm(data=dat, drawDuration ~ cardinality * Game_Condition)#:cardinality)
anova(dr_interac_num)
# summary(dr_interac_num)
dr_interac_aml <- lm(data=dat, drawDuration ~ category * Game_Condition)#:cardinality)
anova(dr_interac_aml)
# summary(dr_interac_aml)

ac_interac_num <- lm(data=dat, outcome ~ cardinality * Game_Condition)#:cardinality)
anova(ac_interac_num)
summary(ac_interac_num)
ac_interac_aml <- lm(data=dat, outcome ~ category * Game_Condition)#:cardinality)
anova(ac_interac_aml)
# summary(ac_interac_aml)









ik_num <- lm(data=dat, meanPixelIntensity ~ cardinality)
ik_aml <- lm(data=dat, meanPixelIntensity ~ category)
ik_cnd <- lm(data=dat, meanPixelIntensity ~ Game_Condition)
ik_qua <- lm(data=dat, meanPixelIntensity ~ quarter)
ik_gid <- lm(data=dat, meanPixelIntensity ~ gameID)
ik_all <- lm(data=dat, meanPixelIntensity ~ cardinality + category + Game_Condition + quarter + gameID)
anova(ik_num)
anova(ik_aml)
anova(ik_cnd)
anova(ik_qua)
anova(ik_gid)
anova(ik_all)


st_num <- lm(data=dat, numStrokes ~ cardinality) # significant of course
st_aml <- lm(data=dat, numStrokes ~ category)
st_cnd <- lm(data=dat, numStrokes ~ Game_Condition) # not significant by itself
st_qua <- lm(data=dat, numStrokes ~ quarter)
st_gid <- lm(data=dat, numStrokes ~ gameID)
st_all <- lm(data=dat, numStrokes ~ cardinality + category + Game_Condition + quarter + gameID)

anova(st_num)
anova(st_aml)
anova(st_cnd)
anova(st_qua)
anova(st_gid)
anova(st_all)


dr_num <- lm(data=dat, drawDuration ~ cardinality)
dr_aml <- lm(data=dat, drawDuration ~ category)
dr_cnd <- lm(data=dat, drawDuration ~ Game_Condition)
dr_qua <- lm(data=dat, drawDuration ~ quarter)
dr_gid <- lm(data=dat, drawDuration ~ gameID)
dr_all <- lm(data=dat, drawDuration ~ cardinality + category + Game_Condition + quarter + gameID)

anova(dr_num)
anova(dr_aml)
anova(dr_cnd)
anova(dr_qua)
anova(dr_gid)
anova(dr_all)


ac_num <- lm(data=dat, outcome ~ cardinality, family = 'binomial')
ac_aml <- lm(data=dat, outcome ~ category, family = 'binomial')
ac_cnd <- lm(data=dat, outcome ~ Game_Condition, family = 'binomial')
ac_qua <- lm(data=dat, outcome ~ quarter, family = 'binomial')
ac_gid <- lm(data=dat, outcome ~ gameID, family = 'binomial')
ac_all <- lm(data=dat, outcome ~ cardinality + category + Game_Condition + quarter + gameID, family = 'binomial')

anova(ac_num)
anova(ac_aml)
anova(ac_cnd)
anova(ac_qua)
anova(ac_gid)
anova(ac_all)






summary(ik_cnd)
summary(st_cnd)
summary(dr_cnd)
summary(ac_cnd)

summary(ik_qua)
summary(st_qua)
summary(dr_qua)
summary(ac_qua)



ik_CrdCnd <- lm(data=dat, meanPixelIntensity ~ cardinality*Game_Condition)
ik_CatCnd <- lm(data=dat, meanPixelIntensity ~ category*Game_Condition)
st_CrdCnd <- lm(data=dat, numStrokes ~ cardinality*Game_Condition)
st_CatCnd <- lm(data=dat, numStrokes ~ category*Game_Condition)
dr_CrdCnd <- lm(data=dat, drawDuration ~ cardinality*Game_Condition)
dr_CatCnd <- lm(data=dat, drawDuration ~ category*Game_Condition)
ac_CrdCnd <- lm(data=dat, outcome ~ cardinality*Game_Condition, family = 'binomial')
ac_CatCnd <- lm(data=dat, outcome ~ category*Game_Condition, family = 'binomial')
anova(ik_CrdCnd)
anova(ik_CatCnd)
anova(st_CrdCnd)
anova(st_CatCnd)
anova(dr_CrdCnd)
anova(dr_CatCnd)
anova(ac_CrdCnd)
anova(ac_CatCnd)
testing <- anova(ac_CatCnd)
testing[3,4]

## AAYYOO run something like this to get at the effect of block on the relationship Card->DV over and above main effect of block:
ik_quarter_corr <- lm(data=dat, meanPixelIntensity ~ cardinality*quarter)
st_quarter_corr <- lm(data=dat, numStrokes ~ cardinality*quarter)
dr_quarter_corr <- lm(data=dat, drawDuration ~ cardinality*quarter)
summary(ik_quarter_corr)
summary(st_quarter_corr)
summary(dr_quarter_corr)




forward <- lm(data=dat, numStrokes ~ category * cardinality * quarter * gameID)
reverse <- lm(data=dat, numStrokes ~ gameID * quarter * cardinality * category)
anova(forward)
anova(reverse)


small <- lm(data=dat, numStrokes ~ cardinality * quarter)
large <- lmer(data=dat, numStrokes ~ cardinality * quarter + (1 | gameID))
biggest <- lmer(data=dat, numStrokes ~ cardinality * quarter + (1 + category | gameID))
oblique <- lmer(data=dat, numStrokes ~ cardinality + category + (1 + quarter | gameID))
anova(large,small)
summary(large)
AIC(large,oblique)
anova(oblique,large)



# glmer_ac <- glmer(data=dat,
#                   outcome ~ cardinality * category * Game_Condition * quarter
#                   + (1 + cardinality*category | gameID),
#                   family = 'binomial',
#                   control=glmerControl(optimizer="bobyqa",
#                                        optCtrl=list(maxfun=2e4)))











strA <- lmer(data = dat,
              numStrokes ~ cardinality * category * Game_Condition * quarter
              + (1 | gameID)) # BIC = 9363.8
strB <- lmer(data = dat,
              numStrokes ~ cardinality * category * Game_Condition * quarter
              + (1 + cardinality| gameID)) # BIC = 9238.6
strC <- lmer(data = dat,
              numStrokes ~ cardinality * category * Game_Condition * quarter
              + (1 + category| gameID)) # BIC = 9279.9

strD <- lmer(data = dat,
              numStrokes ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter
              + (1 + cardinality| gameID)) # BIC = 9174.4
strE <- lmer(data = dat,
             numStrokes ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter
             + (1 + category| gameID)) # BIC = 9203.2 ## DID NOT CONVERGE

simple <- lm(data = dat,
             numStrokes ~ cardinality * category * Game_Condition * quarter)
simpel <- lm(data = dat,
             numStrokes ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter)

whoa <- lmer(data = dat,
             numStrokes ~ ((cardinality*Game_Condition)*quarter + (category*Game_Condition)*quarter)
             + (1 + category| gameID)) # BIC = 
anova(strD,whoa)

summary(testB)
"""
ALL FOR PREDICTING STROKE DV. Repeat with all the other DVs.
None of the lmers converged. So we did BIC to see which random effects (&interaction) could be dropped:
lmer with 1 | gid --> BIC = 9363.8
lmer with 1+catg | gid --> BIC = 9279.9
lmer with 1+card | gid --> BIC = 9238.6    --> winner
For this reason, we kept cardinality in the random effect. Surprising, because you'd expect the way people make shapes to be more idiosyncratic than the way they make number....

Next, we took out any effects that weren't motivated by game condition and its interaction with time (the variables we're interested in). Using numStrokes ~ (cardinality:Game_Condition + category:Game_Condition) * quarter + (1 + category| gameID),
we got:
lmer with experimental --> BIC = 9174.4 (cardinality random effect)    --> winner
                        -> BIC = 9203.2 (category random effect)
"""

# Repeat the above process with ink, and with dur, to find out if also true:
inkA <- lmer(data = dat,
             meanPixelIntensity ~ cardinality * category * Game_Condition * quarter
             + (1 | gameID)) # BIC = -9630.6
inkB <- lmer(data = dat,
             meanPixelIntensity ~ cardinality * category * Game_Condition * quarter
             + (1 + category | gameID)) # BIC = -9594.0 ## DID NOT CONVERGE
inkC <- lmer(data = dat,
             meanPixelIntensity ~ cardinality * category * Game_Condition * quarter
             + (1 + cardinality | gameID)) # BIC = -9996.9
inkD <- lmer(data = dat,
             meanPixelIntensity ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter
             + (1 + cardinality | gameID)) # BIC = -10075.9
inkE <- lmer(data = dat,
             meanPixelIntensity ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter
             + (1 + category | gameID)) # BIC = -9676.1 ## DID NOT CONVERGE
anova(inkB,inkA)
anova(inkA)



durA <- lmer(data = dat,
             drawDuration ~ cardinality * category * Game_Condition * quarter
             + (1 | gameID)) # BIC = 9880.6
durB <- lmer(data = dat,
             drawDuration ~ cardinality * category * Game_Condition * quarter
             + (1 + category | gameID)) # BIC = 9890.3
durC <- lmer(data = dat,
             drawDuration ~ cardinality * category * Game_Condition * quarter
             + (1 + cardinality | gameID)) # BIC = 9818.7

durD <- lmer(data = dat,
             drawDuration ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter
             + (1 + cardinality | gameID)) # BIC = 9741.9
durE <- lmer(data = dat,
             drawDuration ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter
             + (1 + category | gameID)) # BIC = 9811.9

simpel <- lm(data = dat,
             drawDuration ~ ((cardinality*Game_Condition) + (category*Game_Condition)) * quarter)

anova(durD,simpel)

summary(durA)












glm_binomA <- glmer(data=dat,
               outcome ~ cardinality * category * quarter
               + (1 | gameID),
               family = 'binomial')

glm_binomB <- glmer(data=dat,
                    outcome ~ cardinality * category
                    + (1 | gameID),
                    family = 'binomial')

anova(glm_binomA,glm_binomB)

summary(glm_binom)
