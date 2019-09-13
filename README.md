# FreeFall2019
An experiment into productivity programming for a total of 24 hours in sittings of no more than 1 to 2 hours per day to produce a game based on a clone of the Atari Jaguar game 'Down Fall' using only Javascript and HTML5 Canvas, and an IDE that doesn't have code completion (Notepad ++) and the internet for reference.  Additional libraries and frameworks are not aloud.  I will then produce a different game over longer sittings in a more conventional work base setting i.e. 9 – 5 breaking every 2 hours.  After which I will compare the two experiences.

2 hrs 
Started by creating a basic skeleton layout with vector graphics by using the basic move and line to, a gradient fill background and scoreboard.  A basic player object was create containing draw and basic left / right movement controlled by the keyboard.  Also a simple platform object was create containing draw methods.  The start of the main game loop was added to draw everything to screen.

3 hr
Added platform collision method and player drop method to allow player to drop and land on a static platform.  Player will wrap if the sprite leaves the far right / left and bottom of screen. Added collision detection to the platform object so player can collide and stand on the platform.  Next I moved onto dealing with multiple platforms and decide by adding a class to handle platform spawning (at the moment just two) and stores them within an array.  It also deals with player collisions of each platform which now allows the player collision with any of the platforms.  Last minute additions methods to deal with platform movement with wrap around and making sure the player stays on the platform that it has collided with whilst the platform is moving.  

4 hr 
Added a simple title and game over screen and implemented scoring logic.  The scoring is based on the amount of time the player stays on screen.  Providing the player doesn't fall off the bottom of the screen the score is increment.  If the high score is reach the high score is adjusted.  If the player falls off the bottom or disappears off the top of the screen when riding a platform then the game over screen is shown.  The player hits any key to move back to the title screen and again to start the game with their score reset to zero by the high score maintained.  Finished off with a quick refactor of some of the code.

5 hr
Added simple parallax scrolling using wrapping rectangles for time being. Aligned game text;

6 hr
Added a basic random platform generator that regenerates a set of platforms when the current set leaves the top of screen.  

6 hr Retrospective:
Breaking down the sittings to 1 to 2 hours has lead to a defined achievable goal being set for the sitting.  The goals themselves with minimum needed to fulfil and then are built upon and then fleshed out at later sittings.  If this was one continuous sitting i.e. a full day I believe that less would be achieved as the goals would have been though of more in the larger picture.  That along with less rest to allow the brain to reset and digest what work has been achieved.  Even when I am not working on the project I have thoughts about what to work on next and how to tackle the next upcoming goal.
