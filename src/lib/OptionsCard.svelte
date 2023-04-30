<script>
  import CryptoJS from 'crypto-js';
  import { Button, ButtonGroup, Card, Input, Label } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import Select from 'svelte-select';

  import { inputState } from '../stores/input-store';
  import { dataState } from '../stores/options-store';
  import { outputState } from '../stores/output-store';
  import {
    AES_MODE,
    AES_PADDING,
    CIPHER_ALGORITHM,
    ENCODING,
    HASHING_ALGORITHM,
    HMAC_VARIANT,
    SHA2_VARIANT,
  } from '../utils/constants';
  import { getCryptoArguments } from '../utils/helpers';

  const hashingAlgorithmItems = [
    { group: 'Hashing', label: 'MD5', value: HASHING_ALGORITHM.md5 },
    { group: 'Hashing', label: 'SHA-1', value: HASHING_ALGORITHM.sha1 },
    { group: 'Hashing', label: 'SHA-2', value: HASHING_ALGORITHM.sha2 },
    { group: 'Hashing', label: 'SHA-3', value: HASHING_ALGORITHM.sha3 },
    {
      group: 'Hashing',
      label: 'RIPEMD160',
      value: HASHING_ALGORITHM.ripemd160,
    },
    { group: 'Hashing', label: 'HMAC', value: HASHING_ALGORITHM.hmac },
    { group: 'Hashing', label: 'PBKDF2', value: HASHING_ALGORITHM.pbkdf2 },
  ];

  const cipherAlgorithmItems = [
    { group: 'Ciphers', label: 'AES', value: CIPHER_ALGORITHM.aes },
    { group: 'Ciphers', label: 'DES', value: CIPHER_ALGORITHM.des },
    {
      group: 'Ciphers',
      label: 'Triple DES',
      value: CIPHER_ALGORITHM.tripleDes,
    },
    { group: 'Ciphers', label: 'Rabbit', value: CIPHER_ALGORITHM.rabbit },
    { group: 'Ciphers', label: 'RC4', value: CIPHER_ALGORITHM.rc4 },
    { group: 'Ciphers', label: 'RC4Drop', value: CIPHER_ALGORITHM.rc4Drop },
  ];

  const algorithmItems = hashingAlgorithmItems.concat(cipherAlgorithmItems);

  const hmacVariantItems = [
    { label: 'HmacMD5', value: HMAC_VARIANT.hmacMd5 },
    { label: 'HmacRIPEMD160', value: HMAC_VARIANT.hmacRipemd160 },
    { label: 'HmacSHA1', value: HMAC_VARIANT.hmacSha1 },
    { label: 'HmacSHA224', value: HMAC_VARIANT.hmacSha224 },
    { label: 'HmacSHA256', value: HMAC_VARIANT.hmacSha256 },
    { label: 'HmacSHA3', value: HMAC_VARIANT.hmacSha3 },
    { label: 'HmacSHA384', value: HMAC_VARIANT.hmacSha384 },
    { label: 'HmacSHA512', value: HMAC_VARIANT.hmacSha512 },
  ];

  const sha2VariantItems = [
    { label: 'SHA-224', value: SHA2_VARIANT.sha224 },
    { label: 'SHA-256', value: SHA2_VARIANT.sha256 },
    { label: 'SHA-384', value: SHA2_VARIANT.sha384 },
    { label: 'SHA-512', value: SHA2_VARIANT.sha512 },
  ];

  let variantItems = [];

  const aesModeItems = [
    { label: 'CBC', value: AES_MODE.cbc },
    { label: 'CFB', value: AES_MODE.cfb },
    { label: 'CTR', value: AES_MODE.ctr },
    { label: 'OFB', value: AES_MODE.ofb },
    { label: 'ECB', value: AES_MODE.ecb },
  ];

  const aesPaddingItems = [
    { label: 'Pkcs7', value: AES_PADDING.pkcs7 },
    { label: 'Iso97971', value: AES_PADDING.iso97971 },
    { label: 'AnsiX923', value: AES_PADDING.ansiX923 },
    { label: 'Iso10126', value: AES_PADDING.iso10126 },
    { label: 'ZeroPadding', value: AES_PADDING.zeroPadding },
    { label: 'NoPadding', value: AES_PADDING.noPadding },
  ];

  const encodingItems = [
    { label: 'Base64', value: ENCODING.base64 },
    { label: 'Base64url', value: ENCODING.base64url },
    { label: 'Hex', value: ENCODING.hex },
    { label: 'Latin1', value: ENCODING.latin1 },
    { label: 'Utf8', value: ENCODING.utf8 },
    { label: 'Utf16', value: ENCODING.utf16 },
    { label: 'Utf16BE', value: ENCODING.utf16BE },
    { label: 'Utf16LE', value: ENCODING.utf16LE },
  ];

  const sha3OutputLengthItems = [
    { label: '224', value: 224 },
    { label: '256', value: 256 },
    { label: '384', value: 384 },
    { label: '512', value: 512 },
  ];

  let selectedAlgorithm;
  let selectedVariant;

  let isValid = false;

  $: hasVariant = Boolean(variantItems.length);
  $: isCipherAlgorithm = Object.values(cipherAlgorithmItems).some(
    (cipherAlgorithmItem) => cipherAlgorithmItem.value === selectedAlgorithm
  );

  $: isHashingAlgorithm = Object.values(hashingAlgorithmItems).some(
    (hashingAlgorithmItem) => hashingAlgorithmItem.value === selectedAlgorithm
  );

  $: {
    const optionsValidation = {
      aesMode: () =>
        selectedAlgorithm !== CIPHER_ALGORITHM.aes ||
        Boolean($dataState.aesMode),
      aesPadding: () =>
        selectedAlgorithm !== CIPHER_ALGORITHM.aes ||
        Boolean($dataState.aesPadding),
      encoding: () => isHashingAlgorithm || Boolean($dataState.encoding),
      key: () => isHashingAlgorithm || Boolean($dataState.key),
      pbkdf2Iterations: () =>
        selectedAlgorithm !== HASHING_ALGORITHM.pbkdf2 ||
        $dataState.pbkdf2Iterations >= 0,
      pbkdf2KeySize: () =>
        selectedAlgorithm !== HASHING_ALGORITHM.pbkdf2 ||
        $dataState.pbkdf2KeySize >= 0,
      pbkdf2Salt: () =>
        selectedAlgorithm !== HASHING_ALGORITHM.pbkdf2 ||
        Boolean($dataState.pbkdf2Salt),
      rc4DropDrop: () =>
        selectedAlgorithm !== CIPHER_ALGORITHM.rc4Drop ||
        $dataState.rc4DropDrop >= 0,
      sha3OutputLength: () =>
        selectedAlgorithm !== HASHING_ALGORITHM.sha3 ||
        $dataState.sha3OutputLength >= 0,
      standard: () => Boolean($dataState.standard),
    };

    isValid = Object.values(optionsValidation).every((optionsValidationValue) =>
      optionsValidationValue()
    );
  }

  const handleAlgorithmChange = () => {
    switch (selectedAlgorithm) {
      case HASHING_ALGORITHM.hmac:
        variantItems = hmacVariantItems;
        break;
      case HASHING_ALGORITHM.sha2:
        variantItems = sha2VariantItems;
        break;
      default:
        $dataState.standard = selectedAlgorithm;
        selectedVariant = undefined;
        variantItems = [];

        break;
    }

    const firstVariantItem = variantItems[0];
    if (firstVariantItem)
      $dataState.standard = selectedVariant = firstVariantItem.value;
  };

  const handleDecryptClick = () => {
    const args = getCryptoArguments($dataState, $inputState);
    const decrypted = CryptoJS[$dataState.standard]['decrypt'].apply(
      null,
      args
    );

    $outputState = CryptoJS.enc[$dataState.encoding].stringify(decrypted);
  };

  const handleEncryptClick = () => {
    const message = CryptoJS.enc[$dataState.encoding].parse($inputState);
    const args = getCryptoArguments($dataState, message);
    const encrypted = CryptoJS[$dataState.standard]['encrypt'].apply(
      null,
      args
    );

    $outputState = encrypted.toString();
  };

  const handleHashClick = () => {
    const args = getCryptoArguments($dataState, $inputState);
    const hashed = CryptoJS[$dataState.standard].apply(null, args);

    $outputState = hashed.toString();
  };

  const handleValidateClick = () => {
    const args = getCryptoArguments($dataState, $inputState);
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

  onMount(() => {
    const isAlgorithm = algorithmItems.some(
      (algorithmItem) => algorithmItem.value === $dataState.standard
    );

    if (isAlgorithm) {
      selectedAlgorithm = $dataState.standard;
      return;
    }

    const isHmacVariant = hmacVariantItems.some(
      (hmacVariantItem) => hmacVariantItem.value === $dataState.standard
    );

    const isSha2Variant = sha2VariantItems.some(
      (sha2VariantItem) => sha2VariantItem.value === $dataState.standard
    );

    const isVariant = isHmacVariant || isSha2Variant;
    if (isVariant) selectedVariant = $dataState.standard;

    if (isHmacVariant) selectedAlgorithm = HASHING_ALGORITHM.hmac;
    else if (isSha2Variant) selectedAlgorithm = HASHING_ALGORITHM.sha2;
  });
</script>

<Card class="lg:h-100" size="100%">
  <form>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label>Algorithm</Label>
        <Select
          clearable={false}
          groupBy={(item) => item.group}
          items={algorithmItems}
          name="algorithm"
          required
          showChevron
          bind:justValue={selectedAlgorithm}
          on:change={handleAlgorithmChange}
        />
      </div>
      <div>
        <Label>Variant</Label>
        <Select
          clearable={false}
          disabled={!hasVariant}
          items={variantItems}
          name="variant"
          required
          showChevron={hasVariant}
          bind:justValue={selectedVariant}
          on:change={handleVariantChange}
        />
      </div>
      {#if selectedAlgorithm === HASHING_ALGORITHM.sha3}
        <div class="col-span-2">
          <Label>Output Length</Label>
          <Select
            clearable={false}
            items={sha3OutputLengthItems}
            name="sha3-output-length"
            required
            showChevron
            bind:justValue={$dataState.sha3OutputLength}
          />
        </div>
      {/if}
      {#if selectedAlgorithm === HASHING_ALGORITHM.pbkdf2}
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
      {#if selectedAlgorithm === CIPHER_ALGORITHM.aes}
        <div>
          <Label>Mode</Label>
          <Select
            clearable={false}
            items={aesModeItems}
            name="aes-mode"
            required
            showChevron
            bind:justValue={$dataState.aesMode}
          />
        </div>
        <div>
          <Label>Padding</Label>
          <Select
            clearable={false}
            items={aesPaddingItems}
            name="aes-padding"
            required
            showChevron
            bind:justValue={$dataState.aesPadding}
          />
        </div>
      {/if}
      {#if selectedAlgorithm === CIPHER_ALGORITHM.rc4Drop}
        <div class="col-span-2">
          <Label>Drop</Label>
          <Input required type="number" bind:value={$dataState.rc4DropDrop} />
        </div>
      {/if}
      {#if isHashingAlgorithm}
        <div class="col-span-2">
          <Label>Hash</Label>
          <Input type="text" bind:value={$dataState.hash} />
        </div>
      {/if}
      {#if isCipherAlgorithm}
        <div class="col-span-2">
          <Label>Encoding</Label>
          <Select
            clearable={false}
            items={encodingItems}
            name="encoding"
            required
            showChevron
            bind:justValue={$dataState.encoding}
          />
        </div>
      {/if}
      {#if isCipherAlgorithm || selectedAlgorithm === HASHING_ALGORITHM.hmac}
        <div class="col-span-2">
          <Label>Key</Label>
          <Input type="text" bind:value={$dataState.key} />
        </div>
      {/if}
      {#if isCipherAlgorithm || isHashingAlgorithm}
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
