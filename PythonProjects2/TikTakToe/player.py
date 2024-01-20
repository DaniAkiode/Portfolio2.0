import math
import random 

class Player:
    def __init__(self, letter):
        # letter is x or o
        self.letter = letter

    def get_move(self, game):
        pass


class RandomComputerPlayer(Player):
    def __init__ (self, letter):
        super().__init__(letter)

    def get_move(self, game):
        sqaure = random.choice(game.avaialable_moves)

class HumanPlayer(Player):
    def __init__ (self, letter):
        super().__init__(letter)
    
    def get_move(self, game):
        pass