let numActions = 0;
let storyKeys = [];
let currentLocation = "First Compartment";
let numWake = 0;

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // DONE: replace this text using this.engine.storyData to find the story title
        this.engine.show(this.engine.storyData.Subtitle);
        this.engine.addChoice("Begin");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // DONE: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // DONE: use `key` to get the data object for the current story location
        
        this.engine.show(locationData.Body); // DONE: replace this text by the Body of the location data

        if(locationData.Choices != undefined) { // DONE: check if the location has any Choices
            for(let choice of locationData.Choices) { // DONE: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // DONE: use the Text of the choice
                // DONE: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        // train stops auto events
        if (numActions >= 40) {
            this.engine.gotoScene(Location, "Last Stop");
            return;
        }
        else if (numActions == 27) {
            this.engine.gotoScene(Location, "Second Stop CHECK");
            numActions += 1;
            return;
        }
        else if (numActions == 15) {
            this.engine.gotoScene(Location, "First Stop CHECK");
            numActions += 1;
            return;
        }

        // choice handling
        if(choice) {
            numActions += 1;

            this.engine.show("&gt; "+ choice.Text);
            if (choice.Text == "Try to wake him up") {
                if (numWake > 3 && numWake < 7) {
                    choice.Target = "NPC 1 Partial Woken Up"
                    numWake += 1;
                   // this.engine.gotoScene(Location, choice.Target);
                   // return;
                }
                else if (numWake >= 7) {
                    choice.Target = "NPC 1 Woken Up"
                    this.engine.storyData.Locations["First Compartment"].Body = "You look around the compartment. The tall, bearded man sits cross-armed in his seat, now awake."
                   // storyKeys.push(choice.StoryKeyProp);
                   // this.engine.gotoScene(Location, choice.Target);
                   // return;
                }
                else {
                    numWake += 1;
                   // this.engine.gotoScene(Location, choice.Target);
                  //  return;
                }
            }

            if(choice.Door != undefined) {
                if (storyKeys.includes(choice.Door)) {
                    console.log("UNLOCKED");
                    this.engine.gotoScene(Location, (choice.Target + "_VALID"))
                }
                else {
                    console.log("LOCKED");
                    this.engine.gotoScene(Location, (choice.Target + "_INVALID"))
                }
            }
            else if(choice.InteractiveMechanism != undefined) {
                console.log("INTERACTIVE MECHANISM TRIGGERED");

                // window descriptions
                if (choice.Text == "Look out the window") {
                    if (numActions > 4 && numActions < 10) {
                        choice.InteractiveMechanism = "You're passing by a lake. Large clusters of clouds have gathered in the sky; the local fishermen glance up worriedly and start packing up their gear.";
                    }
                    else if (numActions > 10) {
                        choice.InteractiveMechanism = "It's raining too heavily to properly see anything.";
                    }
                }

                this.engine.show(choice.InteractiveMechanism);
                this.engine.gotoScene(Location, choice.Target)
            }
            else {
                if (choice.StoryKeyProp != undefined && !(storyKeys.includes(choice.StoryKeyProp))) {
                    console.log("KEY GIVEN");
                    storyKeys.push(choice.StoryKeyProp);
                }

                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');