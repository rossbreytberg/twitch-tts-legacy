(() => {
  "use strict";

  const CHANNEL_INPUT_ID = "channelInput";
  const DEVICE_SELECTOR_BUTTON_ID = "deviceSelectorButton";
  const VOICE_SELECTOR_BUTTON_ID = "voiceSelectorButton";

  const localSettings = Windows.Storage.ApplicationData.current.localSettings;
  const synthesizer = new Windows.Media.SpeechSynthesis.SpeechSynthesizer();

  let audioDeviceSelector = null;
  let channelInput = null;
  let channelListener = null;
  let isFirstActivation = true;

  WinJS.Application.onactivated = async (args) => {
    if (!isFirstActivation) {
      return;
    }
    isFirstActivation = false;
    await WinJS.UI.processAll();
    Windows.UI.ViewManagement.ApplicationView.getForCurrentView().setPreferredMinSize(
      { width: 310, height: 150 },
    );

    audioDeviceSelector = new AudioDeviceSelector(
      document.getElementById(DEVICE_SELECTOR_BUTTON_ID),
      localSettings,
    );

    channelInput = new ChannelInput(
      document.getElementById(CHANNEL_INPUT_ID),
      localSettings,
      onChangeChannel,
    );

    channelListener = new ChannelListener(
      channelInput.getSelectedChannel(),
      onMessage,
    );

    new VoiceSelector(
      document.getElementById(VOICE_SELECTOR_BUTTON_ID),
      localSettings,
      synthesizer,
    );
  };
  WinJS.Application.start();

  function onChangeChannel(channelName) {
    channelListener.setChannel(channelName);
  }

  async function onMessage(message) {
    const audio = new Audio();
    const stream = await synthesizer.synthesizeTextToStreamAsync(message);
    const blob = MSApp.createBlobFromRandomAccessStream(
      stream.contentType,
      stream,
    );
    audio.src = URL.createObjectURL(blob, { oneTimeOnly: true });
    audio.play();
  }
})();
