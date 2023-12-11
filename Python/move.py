import pyautogui
from time import sleep, strftime
import math

def move_mouse():
    r = 60
    (mx, my)=pyautogui.size()
    pyautogui.moveTo(round(mx/2), round(my/2 -r-r))
    rad2deg = 360 / math.pi
    move_num = 40
    for t in range (move_num):
        round_t = 3
        step = 1/(move_num/round_t)
        x = r*math.cos(step*t*2*math.pi)
        y = r*math.sin(step*t*2*math.pi)
        pyautogui.move(x,y)
    pyautogui.press('shift')

def initialize():
    val = 0
    print("please press enter / time set : 1 + enter")
    val = input()
    if val == "1":
        print("setting for wait time : 1 ~ 30")
        val = input()
        if val.isdecimal() and int(val)>1 and int(val)<31:
            print("begin")
        else:
            val = 3
            print("begin")
    else:
        val = 3
        print("begin")
    return int(val)

def move_mouse_begin():
    wait_min = initialize()
    count_sleep = 0
    print(format(strftime('%H:%M:%S')), "Count:", count_sleep, "Min")
    pos_orig = pyautogui.position()
    wait_min = int(wait_min)

    max_min = 60*8
    check_min = 60

    for idx in range(max_min):
        sleep(check_min)
        pos_current = pyautogui.position()
        dx = pos_orig.x - pos_current.x
        dy = pos_orig.y - pos_current.y
        dist = pow(dx*dx + dy*dy, 0.5)
        pos_orig = pos_current
        if dist < 20:
            count_sleep +=1
        else:
            count_sleep = 0
        print(format(strftime('%H:%M:%S')), "Count:", count_sleep, "Min")

        if count_sleep > wait_min - 1:
            print("moved")
            move_mouse()
            count_sleep = 0
            print(format(strftime('%H:%M:%S')), "Count:", count_sleep, "Min")

# main
move_mouse_begin()
