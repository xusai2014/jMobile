/* eslint-disable */
declare function moment(): any;
declare var _: any;
declare var $: any;
declare var CryptoJS: any;
declare var gloablMinHeight: string; // 页面的满屏高度
declare var sa: any; // 神策统计

declare type PromiseActionType = ['REQUEST', string, 'FAILURE']; // 定义异步事件类型
declare type ActionType = string;
declare type BaseAction = {| // 基本事件
  payload:string,
  data:?Object,
  type:string,
|}

declare type PromiseAction = {| // 定义异步事件
  payload:string,
  types:PromiseActionType,
  promise:Function,
|}


