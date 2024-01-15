import pyautogui
from time import sleep

def initialize():
    print("alert timer set ... READY")
    print("timeCount: 0")

def count_alert():

    initialize()

    count_time = 0
    max_min = 60*8
    check_min = 60

    for idx in range(max_min):
        sleep(check_min)

        # 一時間毎にアラートを発生させる
        count_time +=1
        print("timeCount:", count_time)

        if count_time >= 50:
            pyautogui.alert(text='定期通知', title='通知', button='ok')
            count_time = 0

# main
count_alert()