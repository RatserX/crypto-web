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
  import { onMount } from 'svelte';

  import { inputState } from '../stores/input-store';
  import { dataState } from '../stores/options-store';
  import { outputState } from '../stores/output-store';
    import { AES_MODE, AES_PADDING, CYPHER_ALGORITHM, ENCODING, HASHING_ALGORITHM, HMAC_VARIANT, SHA2_VARIANT } from '../utils/constants';
    import { isObjectEmpty } from '../utils/helpers';

  const hashingAlgorithmItems = [
    { name: 'MD5', value: HASHING_ALGORITHM.md5 },
    { name: 'SHA-1', value: HASHING_ALGORITHM.sha1 },
    { name: 'SHA-2', value: HASHING_ALGORITHM.sha2 },
    { name: 'SHA-3', value: HASHING_ALGORITHM.sha3 },
    { name: 'RIPEMD160', value: HASHING_ALGORITHM.ripemd160 },
    { name: 'HMAC', value: HASHING_ALGORITHM.hmac },
    { name: 'PBKDF2', value: HASHING_ALGORITHM.pbkdf2 },
  ];

  const cypherAlgorithmItems = [
    { name: 'AES', value: CYPHER_ALGORITHM.aes },
    { name: 'DES', value: CYPHER_ALGORITHM.des },
    { name: 'Triple DES', value: CYPHER_ALGORITHM.tripleDes },
    { name: 'Rabbit', value: CYPHER_ALGORITHM.rabbit },
    { name: 'RC4', value: CYPHER_ALGORITHM.rc4 },
    { name: 'RC4Drop', value: CYPHER_ALGORITHM.rc4Drop },
  ];

  const algorithmItems = hashingAlgorithmItems.concat(cypherAlgorithmItems);

  const hmacVariantItems = [
    { name: 'HmacMD5', value: HMAC_VARIANT.hmacMd5 },
    { name: 'HmacRIPEMD160', value: HMAC_VARIANT.hmacRipemd160 },
    { name: 'HmacSHA1', value: HMAC_VARIANT.hmacSha1 },
    { name: 'HmacSHA224', value: HMAC_VARIANT.hmacSha224 },
    { name: 'HmacSHA256', value: HMAC_VARIANT.hmacSha256 },
    { name: 'HmacSHA3', value: HMAC_VARIANT.hmacSha3 },
    { name: 'HmacSHA384', value: HMAC_VARIANT.hmacSha384 },
    { name: 'HmacSHA512', value: HMAC_VARIANT.hmacSha512 },
  ];

  const sha2VariantItems = [
    { name: 'SHA-224', value: SHA2_VARIANT.sha224 },
    { name: 'SHA-256', value: SHA2_VARIANT.sha256 },
    { name: 'SHA-384', value: SHA2_VARIANT.sha384 },
    { name: 'SHA-512', value: SHA2_VARIANT.sha512 },
  ];

  let variantItems = [];

  const aesModeItems = [
    { name: 'CBC', value: AES_MODE.cbc },
    { name: 'CFB', value: AES_MODE.cfb },
    { name: 'CTR', value: AES_MODE.ctr },
    { name: 'OFB', value: AES_MODE.ofb },
    { name: 'ECB', value: AES_MODE.ecb },
  ];

  const aesPaddingItems = [
    { name: 'Pkcs7', value: AES_PADDING.pkcs7 },
    { name: 'Iso97971', value: AES_PADDING.iso97971 },
    { name: 'AnsiX923', value: AES_PADDING.ansiX923 },
    { name: 'Iso10126', value: AES_PADDING.iso10126 },
    { name: 'ZeroPadding', value: AES_PADDING.zeroPadding },
    { name: 'NoPadding', value: AES_PADDING.noPadding },
  ];

  const encodingItems = [
    { name: 'Base64', value: ENCODING.base64 },
    { name: 'Base64url', value: ENCODING.base64url },
    { name: 'Hex', value: ENCODING.hex },
    { name: 'Latin1', value: ENCODING.latin1 },
    { name: 'Utf8', value: ENCODING.utf8 },
    { name: 'Utf16', value: ENCODING.utf16 },
    { name: 'Utf16BE', value: ENCODING.utf16BE },
    { name: 'Utf16LE', value: ENCODING.utf16LE },
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
  $: isCypherAlgorithm = Object.values(cypherAlgorithmItems).some(
    (cypherAlgorithmItem) => cypherAlgorithmItem.value === selectedAlgorithm
  );

  $: isHashingAlgorithm = Object.values(hashingAlgorithmItems).some(
    (hashingAlgorithmItem) => hashingAlgorithmItem.value === selectedAlgorithm
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
        args = [message, !isObjectEmpty(cfg) && cfg];
        break;
      case 'PBKDF2':
        args = [
          message,
          $dataState.pbkdf2Salt,
          !isObjectEmpty(cfg) && cfg,
        ];
        break;
      case 'AES':
      case 'RC4Drop':
        args = [message, $dataState.key, !isObjectEmpty(cfg) && cfg];
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

  onMount(() => {
    const isAlgorithm = algorithmItems.some(
      (algorithmItem) => algorithmItem.value === $dataState.standard
    );

    if (isAlgorithm) {
      selectedAlgorithm = $dataState.standard;
      return;
    }
    console.log(selectedAlgorithm);

    const isHmacVariant = hmacVariantItems.some(
      (hmacVariantItem) => hmacVariantItem.value === $dataState.standard
    );

    const isSha2Variant = sha2VariantItems.some(
      (sha2VariantItem) => sha2VariantItem.value === $dataState.standard
    );

    const isVariant = isHmacVariant || isSha2Variant;
    if (isVariant) selectedVariant = $dataState.standard;

    if (isHmacVariant) selectedAlgorithm = 'HMAC';
    else if (isSha2Variant) selectedAlgorithm = 'SHA2';
  });
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
