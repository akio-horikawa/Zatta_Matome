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

def initialize(): # 起動時処理　何分ごとにカーソルを動かすか設定
    val = 0 # 入力用
    print("please press enter / time set : 1 + enter")
    val = input() # 入力待機
    if val == "1": # "1"入力時には具体的に時間の入力を求める
        print("setting for wait time : 1 ~ 30")
        val = input() # インターバルの入力待機
        if val.isdecimal() and int(val)>1 and int(val)<31: # 範囲内ならば
            print("begin")
        else: # 未入力または範囲外ならば
            val = 3
            print("begin")
    else: # 未入力はデフォルトで3分
        val = 3
        print("begin")
    return int(val) # インターバル時間を返す

def move_mouse_begin(): # 動作する本体
    wait_min = initialize() # 起動時処理
    count_sleep = 0 # 経過時間
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
