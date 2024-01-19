import random

def play():
    user = input("r = rock, p = paper, s = scissors")
    computer = random.choice['r', 'p','s']

    if user == computer:
        return 'tie'
    
    # r > s , s > p, p > r  

def is_win(player, opponent):
    # return true if player wins 
    # r > s , s > p, p > r  ]
    '''if (player == 'r' and opponent == 's') or (player = 's' and oppenent == 'p') \
    or (player == '')'''

