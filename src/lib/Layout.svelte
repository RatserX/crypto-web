<script>
  import {
    Footer,
    FooterCopyright,
    FooterLinkGroup,
    NavBrand,
    Navbar,
    Span,
    FooterIcon,
  } from 'flowbite-svelte';
  import { Buymeacoffee, Github } from 'svelte-simples';

  import InputCard from './InputCard.svelte';
  import OptionsCard from './OptionsCard.svelte';
  import OutputCard from './OutputCard.svelte';
</script>

<div class="lg:h-screen lg:overflow-auto lg:pb-16">
  <Navbar>
    <NavBrand>
      <Span>Crypto</Span>
    </NavBrand>
  </Navbar>
  <div
    class="grid grid-cols-1 lg:grid-cols-2 gap-4 px-8 lg:px-20 py-4 lg:py-10"
  >
    <p class="lg:col-span-2 font-thin dark:text-white">
      Crypto is an online tool that tries to serve as a demo for all the
      standard and secure cryptographic algorithms provided in the JavaScript
      library CryptoJS.
    </p>
    <div>
      <OptionsCard />
    </div>
    <div>
      <InputCard />
    </div>
    <div class="lg:col-span-2">
      <OutputCard />
    </div>
  </div>
</div>
<Footer class="lg:absolute lg:bottom-0 lg:left-0 z-20 w-full rounded-none">
  <FooterCopyright href="https://github.com/RatserX" by="Ratser" year={2023} />
  <FooterLinkGroup
    ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 space-x-6"
  >
    <FooterIcon href="https://github.com/RatserX/crypto-web">
      <Github class="fill-current text-gray-400 hover:text-white" />
    </FooterIcon>
    <FooterIcon href="https://www.buymeacoffee.com/Ratser">
      <Buymeacoffee class="fill-current text-gray-400 hover:text-white" />
    </FooterIcon>
  </FooterLinkGroup>
</Footer>
