


# How do people invent numerals?

Numerals are among the first forms of writing in human history. How did they emerge, and take on the diverse forms that they do?

<p align="center" style="font-size: smaller">
  <img align="left" width="30%" src="https://lh6.googleusercontent.com/7AxnmzE5oATz1UKOJsFW4gURhbAAk_Lr52hJ8ik5CGKHlyeZg_bMNCR6CO0jWw2FJKEpxtbJYVGT3KYBH05y4Jsy42GgTP75CnfqVAai2m8DxF8HCSSW4Bk-4hAnE3xsZgYvI18E"></img>
  WWII airforce pilot, representing a 1-to-1 tally using marks that correspond to each type of event. ([source](https://www.aircorpsart.com/blog/aircraft-victory-mission-markings-of-wwii/))
  
  <img align="center" width="30%" src="https://collectionapi.metmuseum.org/api/collection/v1/iiif/327385/1315111/main-image"></img>
  Mesopotamian administrative tablet representing object-types (barley) and quantities in separate graphical forms, ca. 5,000 yBP. ([source](https://www.metmuseum.org/art/collection/search/327385))
  
  <img align="right" width="30%" src="https://upload.wikimedia.org/wikipedia/commons/d/de/Kaktovik_digit_table.svg"></img>
  Kaktovik numerals, invented by Iñupiaq students in the 1990s to intuitively represent a base-20 system. ([source](https://en.wikipedia.org/wiki/Kaktovik_numerals))
</p>

This repo contains experiments that investigate the emergence of graphical conventions for representing number, using simple communication games.



## Experiments
Partners played a reference game in which one person used graphical tools to communicate numerical information to their partner, using graphical tools.
- In **Experiment 1**, we asked whether and how people would distill numerical information from arrays of objects to create a specifically numerical representation.
- In **Experiment 2**, we asked whether objects arranged in predictable, regular arrays made it easier to develop graphical conventions about number that transcended the use of 1-to-1 correspondence.
- In **Experiment 3**, we asked how the presence of existing symbols might be used to create representations of number in a left-to-right communicative medium.



## This Repo

### Anonymized Pre-registrations
- Available as PDFs under `/osf/`.

### Source Code for Experiments
- Source code for communication tasks is in `/experiments/`, in directories that contain "draw_number".
- Source code for recognition tasks is in `/experiments/`, in directories that contain "classify_iternum".
- Source code for stimulus generation is in `/stimuli/`, in directories with names that match those in `/experiments/`.
- Some additional tools used in the above are in `/utils/`.

### Analysis
- An R script for our pre-registered statistical models can be found in `/analysis/analyses.R`.
- A python notebook for manuscript figures and some simple descriptive statistics can be found in `/analysis/main_analyses.ipynb/`.
- One additional supplementary analysis can be found in `/analysis/supplementary_analysis.ipynb/`.
- Helper functions can be found in `/analysis/utils/`.

### Data & Figures
- `/analysis/results/csv/` contains CSVs of all processed experimental data. It also contains `/extra/`, with raw data, as well as `/features/` and `/classifier/`, generated in the supplementary analysis.
- `/analysis/results/plots/` contains Jupyter notebook output that was used to create the figures in the manuscript.
- `/analysis/results/bare_sketches/` contains sketch results from each experiment, to be processed in our supplementary analysis.
- `/analysis/results/bare_targets/` contains target images for the above sketches.
- `/analysis/results/sketch/` contains sketches annotated with correct / incorrect viewer response, and the corresponding target image.
- `/analysis/results/sketch_galleries/` contains all of the above sketches, arranged into galleries that show all trials from a given game.





