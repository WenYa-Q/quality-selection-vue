/*
 * _______________#########_______________________
 * ______________############_____________________
 * ______________#############____________________
 * _____________##__###########___________________
 * ____________###__######_#####__________________
 * ____________###_#######___####_________________
 * ___________###__##########_####________________
 * __________####__###########_####_______________
 * ________#####___###########__#####_____________
 * _______######___###_########___#####___________
 * _______#####___###___########___######_________
 * ______######___###__###########___######_______
 * _____######___####_##############__######______
 * ____#######__#####################_#######_____
 * ____#######__##############################____
 * ___#######__######_#################_#######___
 * ___#######__######_######_#########___######___
 * ___#######____##__######___######_____######___
 * ___#######________######____#####_____#####____
 * ____######________#####_____#####_____####_____
 * _____#####________####______#####_____###______
 * ______#####______;###________###______#________
 * ________##_______####________####______________
 *
 * @Descripttion:
 * @version:
 * @Date: 2021-07-23 16:10:49
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 15:47:50
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
import { defineStore } from "pinia";
import { getItem, setItem } from "@/utils/storage"; //getItem和setItem是封装的操作localStorage的方法
import defaultSettings from "@/default-settings";

export const useLayoutsettings = defineStore("layoutSettings", {
  state: () => getItem("defaultSettings") || defaultSettings,
  actions: {
    saveSettings(data) {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
      setItem("defaultSettings", data);
    },
  },
});
