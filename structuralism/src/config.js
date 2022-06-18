export const config = {
    // The port to listen on at socket.io clients connect to
    PORT: 2000,
    // During of a single round, the time in seconds the band has to complete the current page
    MAX_TIMER: 30,
    // At which point the audience will be able to see the possible next pages and cast their vote
    SHOW_SCORE_CHOICE_TIMEMARK: 20,
    // The number of rounds to introduce the game over option to the audience
    ROUNDS_TO_INTRODUCE_GAME_OVER: 15
 }