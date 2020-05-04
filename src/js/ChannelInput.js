const ACTIVE_SUFFIX = " (Active)";
const LOCAL_SETTING_CHANNEL_NAME = "channel";

class ChannelInput {
  constructor(inputElement, localSettings, onChannelChange) {
    this._localSettings = localSettings;
    this._onChannelChange = onChannelChange;
    this._input = inputElement;
    this._input.onblur = this._onBlur.bind(this);
    this._input.onclick = this._onClick.bind(this);
    this._selectChannel(this.getSelectedChannel());
    document.onkeydown = this._onKeyDown.bind(this);
  }

  getSelectedChannel() {
    return this._localSettings.values[LOCAL_SETTING_CHANNEL_NAME];
  }

  _onBlur() {
    this._selectChannel(this._input.value || this.getSelectedChannel());
  }

  _onClick() {
    this._input.value = "";
  }

  _onKeyDown(eventInfo) {
    switch (eventInfo.keyCode) {
      case 13: // Enter
        return this._input.blur();
    }
  }

  _selectChannel(channelName) {
    channelName = channelName.replace(ACTIVE_SUFFIX, "");
    if (channelName !== this.getSelectedChannel()) {
      this._localSettings.values[LOCAL_SETTING_CHANNEL_NAME] = channelName;
      this._onChannelChange(channelName);
    }
    this._input.value = channelName ? channelName + ACTIVE_SUFFIX : "";
    this._input.blur();
  }
}
