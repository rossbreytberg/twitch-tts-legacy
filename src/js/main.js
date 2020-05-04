(() => {
  "use strict";

  const CHANNEL_INPUT_ID = "channelInput";
  const DEVICE_SELECTOR_BUTTON_ID = "deviceSelectorButton";
  const VOICE_SELECTOR_BUTTON_ID = "voiceSelectorButton";

  const localSettings = Windows.Storage.ApplicationData.current.localSettings;
  const synthesizer = new Windows.Media.SpeechSynthesis.SpeechSynthesizer();

  let audioRendererSelector = null;
  let channelInput = null;
  let channelListener = null;
  let isFirstActivation = true;

  WinJS.Application.onactivated = async (args) => {
    if (!isFirstActivation) {
      return;
    }
    await WinJS.UI.processAll();
    Windows.UI.ViewManagement.ApplicationView.getForCurrentView().setPreferredMinSize(
      { width: 310, height: 150 },
    );

    audioRendererSelector = new AudioRendererSelector(
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
      onPlayMessageAsync,
    );

    new VoiceSelector(
      document.getElementById(VOICE_SELECTOR_BUTTON_ID),
      localSettings,
      synthesizer,
    );
    isFirstActivation = false;
  };
  WinJS.Application.start();

  function onChangeChannel(channelName) {
    channelListener.setChannel(channelName);
  }

  async function onPlayMessageAsync(message) {
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
