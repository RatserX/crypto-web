<script>
  import CryptoJS from 'crypto-js';
  import {
    Button,
    ButtonGroup,
    Card,
    Input,
    Label,
    Select,
  } from 'flowbite-svelte';

  import objectHelper from '../helpers/object-helper';
  import { inputState } from '../stores/input-store';
  import { dataState } from '../stores/options-store';
  import { outputState } from '../stores/output-store';

  const hashingItems = [
    { name: 'MD5', value: 'MD5' },
    { name: 'SHA-1', value: 'SHA1' },
    { name: 'SHA-2', value: 'SHA2' },
    { name: 'SHA-3', value: 'SHA3' },
    { name: 'RIPEMD160', value: 'RIPEMD160' },
    { name: 'HMAC', value: 'HMAC' },
    { name: 'PBKDF2', value: 'PBKDF2' },
  ];

  const cypherItems = [
    { name: 'AES', value: 'AES' },
    { name: 'DES', value: 'DES' },
    { name: 'Triple DES', value: 'TripleDES' },
    { name: 'Rabbit', value: 'Rabbit' },
    { name: 'RC4', value: 'RC4' },
    { name: 'RC4Drop', value: 'RC4Drop' },
  ];

  const algorithmItems = hashingItems.concat(cypherItems);

  const hmacVariantItems = [
    { name: 'HmacMD5', value: 'HmacMD5' },
    { name: 'HmacRIPEMD160', value: 'HmacRIPEMD160' },
    { name: 'HmacSHA1', value: 'HmacSHA1' },
    { name: 'HmacSHA224', value: 'HmacSHA224' },
    { name: 'HmacSHA256', value: 'HmacSHA256' },
    { name: 'HmacSHA3', value: 'HmacSHA3' },
    { name: 'HmacSHA384', value: 'HmacSHA384' },
    { name: 'HmacSHA512', value: 'HmacSHA512' },
  ];

  const sha2VariantItems = [
    { name: 'SHA-224', value: 'SHA224' },
    { name: 'SHA-256', value: 'SHA256' },
    { name: 'SHA-384', value: 'SHA384' },
    { name: 'SHA-512', value: 'SHA512' },
  ];

  let variantItems = [];

  const aesModeItems = [
    { name: 'CBC', value: 'CBC' },
    { name: 'CFB', value: 'CFB' },
    { name: 'CTR', value: 'CTR' },
    { name: 'OFB', value: 'OFB' },
    { name: 'ECB', value: 'ECB' },
  ];

  const aesPaddingItems = [
    { name: 'Pkcs7', value: 'Pkcs7' },
    { name: 'Iso97971', value: 'Iso97971' },
    { name: 'AnsiX923', value: 'AnsiX923' },
    { name: 'Iso10126', value: 'Iso10126' },
    { name: 'ZeroPadding', value: 'ZeroPadding' },
    { name: 'NoPadding', value: 'NoPadding' },
  ];

  const encodingItems = [
    { name: 'Base64', value: 'Base64' },
    { name: 'Base64url', value: 'Base64url' },
    { name: 'Hex', value: 'Hex' },
    { name: 'Latin1', value: 'Latin1' },
    { name: 'Utf8', value: 'Utf8' },
    { name: 'Utf16', value: 'Utf16' },
    { name: 'Utf16BE', value: 'Utf16BE' },
    { name: 'Utf16LE', value: 'Utf16LE' },
  ];

  const sha3OutputLengthItems = [
    { name: '224', value: 224 },
    { name: '256', value: 256 },
    { name: '384', value: 384 },
    { name: '512', value: 512 },
  ];

  let selectedAlgorithm;
  let selectedVariant;

  let isValid = false;

  $: hasVariant = variantItems.length;
  $: isCypherAlgorithm = Object.values(cypherItems).some(
    (cypherItem) => cypherItem.value === selectedAlgorithm
  );

  $: isHashingAlgorithm = Object.values(hashingItems).some(
    (hashingItem) => hashingItem.value === selectedAlgorithm
  );

  $: {
    const optionsValidation = {
      aesMode: () => selectedAlgorithm !== 'AES' || Boolean($dataState.aesMode),
      aesPadding: () =>
        selectedAlgorithm !== 'AES' || Boolean($dataState.aesPadding),
      encoding: () => isHashingAlgorithm || Boolean($dataState.encoding),
      key: () => isHashingAlgorithm || Boolean($dataState.key),
      pbkdf2Iterations: () =>
        selectedAlgorithm !== 'PBKDF2' || $dataState.pbkdf2Iterations >= 0,
      pbkdf2KeySize: () =>
        selectedAlgorithm !== 'PBKDF2' || $dataState.pbkdf2KeySize >= 0,
      pbkdf2Salt: () =>
        selectedAlgorithm !== 'PBKDF2' || Boolean($dataState.pbkdf2Salt),
      rc4DropDrop: () =>
        selectedAlgorithm !== 'RC4Drop' || $dataState.rc4DropDrop >= 0,
      sha3OutputLength: () =>
        selectedAlgorithm !== 'SHA3' || $dataState.sha3OutputLength >= 0,
      standard: () => Boolean($dataState.standard),
    };

    isValid = Object.values(optionsValidation).every((optionsValidationValue) =>
      optionsValidationValue()
    );
  }

  const getCryptoArguments = (message) => {
    let cfg = {};

    switch (selectedAlgorithm) {
      case 'AES':
        cfg = {
          mode: CryptoJS.mode[$dataState.aesMode],
          padding: CryptoJS.pad[$dataState.aesPadding],
        };

        break;
      case 'SHA3':
        cfg = {
          outputLength: $dataState.sha3OutputLength,
        };

        break;
      case 'PBKDF2':
        cfg = {
          ...($dataState.pbkdf2Iterations >= 0 && {
            iterations: $dataState.pbkdf2Iterations,
          }),
          ...($dataState.pbkdf2KeySize >= 0 && {
            keySize: $dataState.pbkdf2KeySize,
          }),
        };

        break;
      case 'RC4Drop':
        cfg = {
          drop: $dataState.rc4DropDrop,
        };

        break;
      default:
        break;
    }

    let args = [];

    switch (selectedAlgorithm) {
      case 'DES':
      case 'HMAC':
      case 'RC4':
      case 'TripleDES':
        args = [message, $dataState.key];
        break;
      case 'SHA3':
        args = [message, !objectHelper.isEmpty(cfg) && cfg];
        break;
      case 'PBKDF2':
        args = [
          message,
          $dataState.pbkdf2Salt,
          !objectHelper.isEmpty(cfg) && cfg,
        ];
        break;
      case 'AES':
      case 'RC4Drop':
        args = [message, $dataState.key, !objectHelper.isEmpty(cfg) && cfg];
        break;
      default:
        args = [message];
        break;
    }

    return args;
  };

  const handleAlgorithmChange = () => {
    switch (selectedAlgorithm) {
      case 'HMAC':
        variantItems = hmacVariantItems;
        break;
      case 'SHA2':
        variantItems = sha2VariantItems;
        break;
      default:
        $dataState.standard = selectedAlgorithm;
        selectedVariant = undefined;
        variantItems = [];

        break;
    }

    const firstVariant = variantItems[0];
    if (firstVariant)
      $dataState.standard = selectedVariant = firstVariant.value;
  };

  const handleDecryptClick = () => {
    const args = getCryptoArguments($inputState);
    const decrypted = CryptoJS[$dataState.standard]['decrypt'].apply(
      null,
      args
    );

    $outputState = CryptoJS.enc[$dataState.encoding].stringify(decrypted);
  };

  const handleEncryptClick = () => {
    const message = CryptoJS.enc[$dataState.encoding].parse($inputState);
    const args = getCryptoArguments(message);
    const encrypted = CryptoJS[$dataState.standard]['encrypt'].apply(
      null,
      args
    );

    $outputState = encrypted.toString();
  };

  const handleHashClick = () => {
    const args = getCryptoArguments($inputState);
    const hashed = CryptoJS[$dataState.standard].apply(null, args);

    $outputState = hashed.toString();
  };

  const handleValidateClick = () => {
    const args = getCryptoArguments($inputState);
    const hashed = CryptoJS[$dataState.standard].apply(null, args);

    if ($dataState.hash === hashed.toString()) {
      $outputState = 'Hash matches the input text.';
    } else {
      $outputState = 'Hash does not match the input text.';
    }
  };

  const handleVariantChange = () => {
    $dataState.standard = selectedVariant;
  };
</script>

<Card class="lg:h-100" size="100%">
  <form>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label>Algorithm</Label>
        <Select
          items={algorithmItems}
          required
          title="Algorithm"
          bind:value={selectedAlgorithm}
          on:change={handleAlgorithmChange}
        />
      </div>
      <div>
        <Label>Variant</Label>
        <Select
          disabled={!hasVariant}
          items={variantItems}
          required
          title="Variant"
          bind:value={selectedVariant}
          on:change={handleVariantChange}
        />
      </div>
      {#if selectedAlgorithm === 'AES'}
        <div>
          <Label>Mode</Label>
          <Select
            items={aesModeItems}
            required
            title="Mode"
            bind:value={$dataState.aesMode}
          />
        </div>
        <div>
          <Label>Padding</Label>
          <Select
            items={aesPaddingItems}
            required
            title="Padding"
            bind:value={$dataState.aesPadding}
          />
        </div>
      {/if}
      {#if selectedAlgorithm === 'PBKDF2'}
        <div>
          <Label>Iterations</Label>
          <Input
            required
            type="number"
            bind:value={$dataState.pbkdf2Iterations}
          />
        </div>
        <div>
          <Label>Key Size</Label>
          <Input required type="number" bind:value={$dataState.pbkdf2KeySize} />
        </div>
        <div class="col-span-2">
          <Label>Salt</Label>
          <Input required type="text" bind:value={$dataState.pbkdf2Salt} />
        </div>
      {/if}
      {#if selectedAlgorithm === 'RC4Drop'}
        <div class="col-span-2">
          <Label>Drop</Label>
          <Input required type="number" bind:value={$dataState.rc4DropDrop} />
        </div>
      {/if}
      {#if selectedAlgorithm === 'SHA3'}
        <div class="col-span-2">
          <Label>Output Length</Label>
          <Select
            items={sha3OutputLengthItems}
            required
            title="Output Length"
            bind:value={$dataState.sha3OutputLength}
          />
        </div>
      {/if}
      {#if isHashingAlgorithm}
        <div class="col-span-2">
          <Label>Hash</Label>
          <Input type="text" bind:value={$dataState.hash} />
        </div>
      {/if}
      {#if isCypherAlgorithm}
        <div>
          <Label>Encoding</Label>
          <Select
            items={encodingItems}
            required
            title="Encoding"
            bind:value={$dataState.encoding}
          />
        </div>
        <div>
          <Label>Key</Label>
          <Input type="text" bind:value={$dataState.key} />
        </div>
      {/if}
      {#if isCypherAlgorithm || isHashingAlgorithm}
        <div class="col-span-2">
          <ButtonGroup class="w-full">
            {#if isHashingAlgorithm}
              <Button
                class="w-full"
                disabled={!isValid}
                on:click={handleHashClick}>Hash</Button
              >
              <Button
                class="w-full"
                disabled={!isValid}
                on:click={handleValidateClick}>Validate</Button
              >
            {:else}
              <Button
                class="w-full"
                disabled={!isValid}
                on:click={handleDecryptClick}>Decrypt</Button
              >
              <Button
                class="w-full"
                disabled={!isValid}
                on:click={handleEncryptClick}>Encrypt</Button
              >
            {/if}
          </ButtonGroup>
        </div>
      {/if}
    </div>
  </form>
</Card>
