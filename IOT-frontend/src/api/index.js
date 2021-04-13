import { instance } from '../util/request';
import { consts } from '../util/consts';
import {
    resetData,
    setLampsData,
    getLampsData,
    // setLeaveHomeLampIdsData,
    getLeaveHomeLampIdsData,
    // setPartyLampIdsData,
    getPartyLampIdsData,
    // setReturnHomeLampIdsData,
    getReturnHomeLampIdsData,
    setIsPartyData,
    getIsPartyData
} from '../util/storage';

const {
    onUrl,
    offUrl,
    brightnessUrl,
    colorUrl,
    disconnectUrl,
    getLampsUrl,
    getLeaveHomeLampIdsUrl,
    getReturnHomeLampIdsUrl,
    getPartyLampIdsUrl,
    getIsPartyUrl,
    setIsPartyUrl,
    useMock
} = consts;

// TODO 添加更新智慧场景相关灯具列表接口
let api = {
    /**
     * 打开灯具
     * @param {String} lampId 
     */
    on (lampId) {
        return instance.post(onUrl, { lampId });
    },
    /**
     * 关闭灯具
     * @param {String} lampId 
     */
    off (lampId) {
        return instance.post(offUrl, { lampId });
    },
    /**
     * 调整亮度
     * @param {String} lampId 
     * @param {Number} brightness 1-100
     */
    brightness (lampId, brightness) {
        return instance.post(brightnessUrl, { lampId, brightness });
    },
    /**
     * 调整颜色
     * @param {String} lampId 
     * @param {Number} color 0-2
     */
    color (lampId, color) {
        return instance.post(colorUrl, { lampId, color });
    },
    /**
     * 连接设备
     * TODO 后端暂无该接口
     * @param {String} lampId 
     */
    connect (lampId) {
        console.log(`[INFO] connect lampId: ${ lampId }`);
        return Promise.resolve();
    },
    /**
     * 断开连接
     * @param {String} lampId 
     */
    disconnect (lampId) {
        return instance.post(disconnectUrl, { lampId });
    },
    /**
     * 获取灯泡数据
     * TODO 确认颜色为 下标 还是 颜色值
     * color 为备选颜色常量
     * 亮度 0-100
     * @returns {Promise<Array<{ name: String, id: String, isOn: Boolean, color: String, brightness: Number, isConnected: Boolean, lastUseTime: Number }>>}
     */
    getLamps () {
        return instance.get(getLampsUrl);
    },
    /**
     * 获取离家相关灯具ID列表
     * @returns {Promise<Array<String>>}
     */
    getLeaveHomeLampIds () {
        return instance.get(getLeaveHomeLampIdsUrl);
    },
    /**
     * 获取归家相关灯具ID列表
     * @returns {Promise<Array<String>>}
     */
    getReturnHomeLampIds () {
        return instance.get(getReturnHomeLampIdsUrl);
    },
    /**
     * 获取Party相关灯具ID列表
     * @returns {Promise<Array<String>>}
     */
    getPartyLampIds () {
        return instance.get(getPartyLampIdsUrl);
    },
    /**
     * 获取Party模式开启状态
     * @returns {Promise<Boolean>}
     */
    getIsParty () {
        return instance.get(getIsPartyUrl);
    },
    /**
     * 设置Party模式开启状态
     * @param {Boolean} isParty 
     * @returns {Promise<Boolean>}
     */
    setIsParty (isParty) {
        return instance.post(setIsPartyUrl, { isParty });
    }
};

function updateLampTemplate (lampId, updateLampCallback) {
    const lamps = getLampsData();
    for (const lamp of lamps)
    {
        if (lamp.id === lampId)
        {
            updateLampCallback(lamp);
        }
    }
    setLampsData(lamps);
}

const mockApi = {
    on (lampId) {
        updateLampTemplate(lampId, lamp => {
            lamp.isOn = true;
        });
        return Promise.resolve();
    },
    off (lampId) {
        updateLampTemplate(lampId, lamp => {
            lamp.isOn = false;
        });
        return Promise.resolve();
    },
    brightness (lampId, brightness) {
        updateLampTemplate(lampId, lamp => {
            lamp.brightness = brightness;
        });
        return Promise.resolve();
    },
    color (lampId, color) {
        updateLampTemplate(lampId, lamp => {
            lamp.color = color;
        });
        return Promise.resolve();
    },
    connect (lampId) {
        updateLampTemplate(lampId, lamp => {
            lamp.isConnected = true;
        });
        return Promise.resolve();
    },
    disconnect (lampId) {
        updateLampTemplate(lampId, lamp => {
            lamp.isConnected = false;
        });
        return Promise.resolve();
    },
    getLamps () {
        const data = getLampsData();
        return Promise.resolve({ data });
    },
    getLeaveHomeLampIds () {
        const data = getLeaveHomeLampIdsData();
        return Promise.resolve({ data });
    },
    getReturnHomeLampIds () {
        const data = getReturnHomeLampIdsData();
        return Promise.resolve({ data });
    },
    getPartyLampIds () {
        const data = getPartyLampIdsData();
        return Promise.resolve({ data });
    },
    getIsParty () {
        const data = getIsPartyData();
        return Promise.resolve({ data });
    },
    setIsParty (isParty) {
        setIsPartyData(isParty);
        return Promise.resolve();
    }
};

if (useMock)
{
    resetData();
    api = mockApi;
}

export { api };
