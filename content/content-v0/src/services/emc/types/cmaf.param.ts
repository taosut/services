export const cmafParams: AWS.MediaConvert.CreateJobRequest = {
  Queue: 'arn:aws:mediaconvert:ap-southeast-1:207219370128:queues/Default',
  UserMetadata: {},
  Role: 'arn:aws:iam::207219370128:role/MediaConvertRole',
  Settings: {
    OutputGroups: [
      {
        Name: 'CMAF',
        OutputGroupSettings: {
          Type: 'CMAF_GROUP_SETTINGS',
          CmafGroupSettings: {
            WriteHlsManifest: 'ENABLED',
            WriteDashManifest: 'ENABLED',
            SegmentLength: 10,
            MinFinalSegmentLength: 0,
            FragmentLength: 2,
            SegmentControl: 'SINGLE_FILE',
            MpdProfile: 'MAIN_PROFILE',
            ManifestDurationFormat: 'INTEGER',
            StreamInfResolution: 'INCLUDE',
            ClientCache: 'ENABLED',
            ManifestCompression: 'NONE',
            CodecSpecification: 'RFC_4281',
            Destination: 's3://agora-files/agora/video/',
          },
        },
        Outputs: [
          {
            NameModifier: '_360',
            Preset:
              'System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_640x360p_30Hz_0.8Mbps_Cbr',
          },
          {
            NameModifier: '_540',
            Preset:
              'System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_960x540p_30Hz_2.5Mbps_Cbr',
          },
          {
            NameModifier: '_720',
            Preset:
              'System-Ott_Cmaf_Cmfc_Avc_16x9_Sdr_1280x720p_30Hz_4Mbps_Cbr',
          },
        ],
      },
    ],
    AdAvailOffset: 0,
    Inputs: [
      {
        AudioSelectors: {
          'Audio Selector 1': {
            Offset: 0,
            DefaultSelection: 'DEFAULT',
            ProgramSelection: 1,
          },
        },
        VideoSelector: {
          ColorSpace: 'FOLLOW',
          Rotate: 'DEGREE_0',
        },
        FilterEnable: 'AUTO',
        PsiControl: 'USE_PSI',
        FilterStrength: 0,
        DeblockFilter: 'DISABLED',
        DenoiseFilter: 'DISABLED',
        TimecodeSource: 'EMBEDDED',
        FileInput: 's3://agora-files/agora/video/file_name',
      },
    ],
  },
  AccelerationSettings: {
    Mode: 'DISABLED',
  },
  StatusUpdateInterval: 'SECONDS_60',
  Priority: 0,
};
