
library(tidyverse)
library(ggplot2)
library(gridExtra) # to arrange plots in figure
library(comprehenr) # for list comprehension

### Part 1: Read all the data
# df2 <- read_csv("iternum_data2_incl.csv")
# df3 <- read_csv("iternum_data3.csv")
df2 <- read_csv("../results/csv/iternum_data2_incl.csv")
df3 <- read_csv("../results/csv/iternum_data3.csv")

# split df2 into two parts, one for each condition
df2reg <- df2 %>% filter(Regularity == 'regular')
df2ran <- df2 %>% filter(Regularity == 'random')

# slightly more cleaning to do on df3
df3$PT <- df3$submitTime - df3$trialStartTime
df3$RT <- df3$clickedTime - df3$submitTime # this is less than 0 exactly once. Ignore it?
df3$tokenRatio <- df3$messageLength / df3$cardinality  # number of tokens (1-to-1)
df3$strokeRatio <- df3$messageLength / df3$cardinality  # exact same as above, but so we can treat it with the data from Experiment 2
df3$symbolRatio <- df3$symbolsSum / df3$cardinality   # summed symbols (additive)





### Part 2: Write the useful functions
# first is log-likelihood function
loglik = function(DATA, match_percent, std1,   mean_comp, std2) { # compr_percent not a free param
  data = na.omit(DATA) # df2$strokeRatio[294] is NA, for example
  
  # first generate the probability of seeing every datapoint from the matching distribution
  matching_lik = dnorm(data, mean = 1, sd = std1) #* std1  # take sum of this, or later?
  # then generate that probability from the compressed distribution
  compress_lik = dnorm(data, mean = mean_comp, sd = std2) #* std2
  # now, for every datapoint, say which distribution more likely produced it
  argmaxes = as.numeric(apply(cbind(matching_lik,compress_lik), 1, which.max)) - 1 # get zero-indexed so that we can just add up the ones
  # figuring out argmax took longer than it was supposed to. Why can't I call "which.pmax"??
  # https://stackoverflow.com/questions/17252798/using-argmax-or-something-simpler-in-r
  # https://rdrr.io/cran/omnibus/src/R/which.pmax.r
  
  # now get an estimate of how many trials best fit the 'compressing' strategy (index=1)
  q = sum(argmaxes) / length(argmaxes)
  
  ll = sum(log(pmax(matching_lik,compress_lik)))
  
  # # this block used to exist when distinguishing perfect-matchers vs approximators. It never worked anyway
  # ifelse(data == 1, # if the data point is exactly 1, it might just be perfect
  #        sample(c(log(max(matching_lik,compress_lik)),0),1,prob=c(1-match_percent,match_percent)),
  #        log(pmax(matching_lik,compress_lik))
  #        )
  
  return(c(ll , q)) # return both the log likelihood of the whole model, and estimate of strategies
}

# then the function that actually iterates over our parameter search-space for best fitting model, given the likelihood function above
maximize_LL = function(D){
  
  SAMPLE_N = length(D$strokeRatio) # number of sample "participants" to use in simulation data, 2016 for all data
  
  loglik_estimates = data.frame(loglik = c(),
                                q = c(),
                                p = c(),
                                sd_approx = c(),
                                avg_comp = c(),
                                sd_comp = c())
  
  #create data frame with 0 rows and 6 columns
  loglik_estimates <- data.frame(matrix(ncol = 6, nrow = 0))
  
  #provide column names
  colnames(loglik_estimates) <- c('loglik', 'q', 'p', 'sd_approx', 'avg_comp', 'sd_comp')
  
  
  prop_seq = seq(0, 0, .1) # this is trivial now and we're not using it
  sd1_seq  = seq(0, .2, .02)
  avg_seq  = seq(0, .6, .02)
  sd2_seq  = seq(0, .3, .02)
  
  steps = length(prop_seq) * length(sd1_seq) * length(avg_seq) * length(sd2_seq)
  x <- rep(x = NA, times = steps)
  pb <- txtProgressBar(0, length(x), style = 3)
  prog = 1;
  
  # Now brute-force it
  for (prop in prop_seq){            # for every % of perfect matchers
    for (sd1 in sd1_seq){            # for every sd of approximators
      for (avg in avg_seq){          # for every mean of compressed
        for (sd2 in sd2_seq){        # for every sd of compressed
          
          setTxtProgressBar(pb, prog) # update the progress bar
          x[prog] 
          prog = prog + 1
          
          simulation = loglik(D$strokeRatio,
                              prop,sd1, # % of perfect matchers, sd of approximators
                              avg,sd2) # mean of compressed, sd of compressed
          loglik_estimates = loglik_estimates %>% add_row(loglik = simulation[1],
                                                          q = simulation[2],
                                                          p = prop,
                                                          sd_approx = sd1,
                                                          avg_comp = avg,
                                                          sd_comp = sd2)
          
        }
      }
    }
  }
  close(pb)
  
  # sometimes we're estimating infinite log likelihood. Is this a problem? Get rid of them, for now
  loglik_estimates <- loglik_estimates[is.finite(rowSums(loglik_estimates)),]
  
  # find the maximum log likelihood and get the parameters from that
  winning_params = loglik_estimates[which.max(loglik_estimates$loglik),]
  
  return(c(winning_params , loglik_estimates))
}



### Part 3: Run the simulations
# first, set how many draws we plan to take
draws = 3 # 500

# step 1: sample participants randomly with replacement from each condition, many times
# we're going to do this a bunch of times, and generate winning parameters each time via MLE
# the these winning estimates over each sampled set of participants will form a distribution
# and that distribution will be our uncertainty (hopefully the distribution of each condition is either obviously null, or is very obviously different to the other condition)


#create data frame with 0 rows and 6 columns
ps <- data.frame(matrix(ncol = 6, nrow = 0))
ran_ps <- data.frame(matrix(ncol = 6, nrow = 0))
reg_ps <- data.frame(matrix(ncol = 6, nrow = 0))
ex3_ps <- data.frame(matrix(ncol = 6, nrow = 0))

#provide column names
colnames(ps) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')
colnames(ran_ps) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')
colnames(reg_ps) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')
colnames(ex3_ps) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')


# now iterate through all of the draws
for (i in 1:draws){
  cat("\014")
  print(i)
  
  ps_i <- data.frame(matrix(ncol = 6, nrow = 0))
  colnames(ps_i) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')
  
  # # set the seed for this draw, for this 'kernel_base' (parallel functions computing on the server)
  # set.seed(i+draws)
  
  # first generate the list of games, then sample that list, then sample the dataframe
  # then maximize_LL on the sample:
  #create data frame with 0 rows and 2 columns (we only need gameID and strokeRatio)
  sampled_games <- data.frame(matrix(ncol = 2, nrow = 0))
  
  #provide column names
  colnames(sampled_games) <- c('GID','ratio')
  
  games2sample <- sample(unique(df2ran$gameID), length(unique(df2ran$gameID)), replace = TRUE)
  
  # add all the sampled games to a dataframe (you can't subset, because then it will negate the 'replace = TRUE')
  for(game in games2sample){
    sampled_game <- df2ran[df2ran$gameID %in% c(game),]
    sampled_games <- rbind(sampled_games,sampled_game)
  }
  
  ran <- maximize_LL(sampled_games)[1:6]

  # we only add winning estimates to our list; one for each sample of games
  ps_i = ps_i %>% add_row(cond=0,
                              loglik=ran$loglik,
                              q=ran$q,
                              sd_approx=ran$sd_approx,
                              avg_comp=ran$avg_comp,
                              sd_comp=ran$sd_comp) 
  



  #create data frame with 0 rows and 2 columns (we only need gameID and strokeRatio)
  sampled_games <- data.frame(matrix(ncol = 2, nrow = 0))

  #provide column names
  colnames(sampled_games) <- c('GID','ratio')

  games2sample <- sample(unique(df2reg$gameID), length(unique(df2reg$gameID)), replace = TRUE)

  # add all the sampled games to a dataframe (you can't subset, because then it will negate the 'replace = TRUE')
  for(game in games2sample){
    sampled_game <- df2reg[df2reg$gameID %in% c(game),]
    sampled_games <- rbind(sampled_games,sampled_game)
  }

  reg <- maximize_LL(sampled_games)[1:6]


  ps_i = ps_i %>% add_row(cond=1,
                              loglik=reg$loglik,
                              q=reg$q,
                              sd_approx=reg$sd_approx,
                              avg_comp=reg$avg_comp,
                              sd_comp=reg$sd_comp)

  # parameters here: data, number of samples (define it as number of games, with replacement)
  #create data frame with 0 rows and 2 columns (we only need gameID and strokeRatio)
  sampled_games <- data.frame(matrix(ncol = 2, nrow = 0))

  #provide column names
  colnames(sampled_games) <- c('GID','ratio')

  games2sample <- sample(unique(df3$gameID), length(unique(df3$gameID)), replace = TRUE)

  # add all the sampled games to a dataframe (you can't subset, because then it will negate the 'replace = TRUE')
  for(game in games2sample){
    sampled_game <- df3[df3$gameID %in% c(game),]
    sampled_games <- rbind(sampled_games,sampled_game)
  }

  ex3 <- maximize_LL(sampled_games)[1:6]

  ps_i <- ps_i %>% add_row(cond=2,
                               loglik=ex3$loglik,
                               q=ex3$q,
                               sd_approx=ex3$sd_approx,
                               avg_comp=ex3$avg_comp,
                               sd_comp=ex3$sd_comp)
  
  write.csv(ps_i,file=paste(getwd(),sprintf('/datastructures/mixture_model_no_seed/ps_%s.csv',i),sep = ""))
  ps <- rbind(ps,ps_i)
  

}



# take our different conditions and append them into the same dataframe
ps <- rbind(ran_ps,reg_ps, ex3_ps)
ps$cond <- gsub("0", "Random", ps$cond)
ps$cond <- gsub("1", "Regular", ps$cond)
ps$cond <- gsub("2", "Third", ps$cond)

files <- list.files(path = "datastructures/mixture_model/", pattern = "*.csv")

ps <- files %>% 
  map(function(x) {
    read.csv(paste0("datastructures/mixture_model/", x))
  }) %>%
  reduce(rbind)





# Part 4: Plot the results into a figure and save that figure out
# feed ps as the df into this function. The parameter (p) is a string
plotEstimates <- function(df,p, leftmost=FALSE, plot=TRUE){
  # write a dictionary for how we nicely label each parameter (for the plot labels)
  param_dict <- c("q"="Prop. Compressed",
                  "avg_comp"="Compr. Avg.",
                  "sd_approx"="Approx. SD",
                  "sd_comp"="Compr. SD")
  
  # get the percentiles from whatever parameter we're looking at
  p_mean = df %>% group_by(cond) %>% group_map(~ mean(.x[[p]])) %>% as.numeric()
  p_CI =   df %>% group_by(cond) %>% group_map(~ quantile(.x[[p]], probs = c(0.025, 0.975)))
  
  # create the plot as an object that this function can return
  pl = ggplot() +
    geom_bar( aes(x=unique(df$cond),
                  y=p_mean), stat="identity", fill="skyblue", alpha=0.7)+
    geom_errorbar( aes(x=unique(df$cond),
                       ymin=to_vec(for(i in 1:length(unique(df$cond))) p_CI[[i]][['2.5%']]), # however many conditions, use them all
                       ymax=to_vec(for(i in 1:length(unique(df$cond))) p_CI[[i]][['97.5%']])),
                   width=0.4, colour="black", alpha=0.9, size=.5) +
    labs(title = param_dict[p], x = "Condition", y=NULL) +
    coord_cartesian(ylim = c(0, 1)) +
    scale_x_discrete(guide = guide_axis(angle = -45))
  
  if(leftmost==FALSE){
    pl = pl + theme(axis.text.y=element_blank(),  #remove y axis labels
                    axis.ticks.y=element_blank())  #remove y axis ticks
  }
  if(plot == TRUE){
    return(pl)
  } else{
    return(c(p_mean,p_CI))
  }
}


# Opening the graphical device
pdf("param_estimates.pdf", width = 10, height = 6,)

# making our plots using the function
grid.arrange(plotEstimates(ps,'q',leftmost=TRUE),
             plotEstimates(ps,'avg_comp'),
             plotEstimates(ps,'sd_approx'),
             plotEstimates(ps,'sd_comp'),
             ncol=4)

# Closing the graphical device
dev.off() 



























#create data frame with 0 rows and 6 columns
observed_fits <- data.frame(matrix(ncol = 6, nrow = 0))

#provide column names
colnames(observed_fits) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')

# set the seed for this draw
set.seed(2022)

ran <- maximize_LL(df2ran)[1:6]
reg <- maximize_LL(df2reg)[1:6]

observed_fits <- observed_fits %>% add_row(cond=0,
                                           loglik=ran$loglik,
                                           q=ran$q,
                                           sd_approx=ran$sd_approx,
                                           avg_comp=ran$avg_comp,
                                           sd_comp=ran$sd_comp)
observed_fits <- observed_fits %>% add_row(cond=1,
                                           loglik=reg$loglik,
                                           q=reg$q,
                                           sd_approx=reg$sd_approx,
                                           avg_comp=reg$avg_comp,
                                           sd_comp=reg$sd_comp)

obs_diff <- observed_fits[1,] - observed_fits[2,]















# Part 5: Do a different version, this time with p-values

pdraws <- 500

#create data frame with 0 rows and 6 columns
pval_df <- data.frame(matrix(ncol = 6, nrow = 0))

#provide column names
colnames(pval_df) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')


# now iterate through all of the draws
for (i in 1:pdraws){
  cat("\014")
  print(i)
  
  # set the seed for this draw
  set.seed(i)
  
  # initialize the df to be used for this iteration
  pv_i <- data.frame(matrix(ncol = 6, nrow = 0))
  colnames(pv_i) <- c('cond','loglik', 'q', 'sd_approx', 'avg_comp', 'sd_comp')
  
  #create data frame with 0 rows and 2 columns (we only need gameID and strokeRatio)
  sampled_games <- data.frame(matrix(ncol = 2, nrow = 0))
  
  #provide column names
  colnames(sampled_games) <- c('GID','ratio')
  
  # get a random set of 59 games, drawn with replacement from all games
  games2sample <- sample(unique(df2$gameID), length(unique(df2$gameID)), replace = TRUE)
  
  # add all the sampled games to a dataframe (you can't subset, because then it will negate the 'replace = TRUE')
  for(game in games2sample){
    sampled_game <- df2[df2$gameID %in% c(game), ]
    sampled_games <- rbind(sampled_games,sampled_game)
  }
  
  ran <- maximize_LL(sampled_games[1:29, ])[1:6]
  reg <- maximize_LL(sampled_games[30:59, ])[1:6]
  
  pv_i <- pv_i %>% add_row(cond=0,
                               loglik=ran$loglik,
                               q=ran$q,
                               sd_approx=ran$sd_approx,
                               avg_comp=ran$avg_comp,
                               sd_comp=ran$sd_comp)
  pv_i <- pv_i %>% add_row(cond=1,
                               loglik=reg$loglik,
                               q=reg$q,
                               sd_approx=reg$sd_approx,
                               avg_comp=reg$avg_comp,
                               sd_comp=reg$sd_comp)
  
  write.csv(pv_i,file=paste(getwd(),sprintf('/datastructures/mm_pvals/pv_%s.csv',i),sep = ""))
  
  pval_df <- rbind(pval_df,ps_i)
  
}


files <- list.files(path = "datastructures/mm_pvals/", pattern = "*.csv")

pval_df <- files %>% 
  map(function(x) {
    temp = read.csv(paste0("datastructures/mm_pvals/", x))
    temp_ran = temp %>% filter(cond == 0)
    temp_reg = temp %>% filter(cond == 1)
    return(temp_ran - temp_reg)
  }) %>%
  reduce(rbind)

temp = pval_df
temp$cond = gsub("0", "Random", temp$cond)
temp$cond = gsub("1", "Regular", temp$cond)


# Change line color by condition
ggplot(pval_df, aes(x = q)) +
  geom_histogram(aes(),
                 position = "identity", bins = 100, alpha = .5)



# ecdf returns a function that gives you a percentile, so just call it on the observed value
ecdf(pval_df[['q']])(obs_diff$q)
ecdf(pval_df[['sd_approx']])(obs_diff$sd_approx)
ecdf(pval_df[['avg_comp']])(obs_diff$avg_comp)
ecdf(pval_df[['sd_comp']])(obs_diff$sd_comp)


