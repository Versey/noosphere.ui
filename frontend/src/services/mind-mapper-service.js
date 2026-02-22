const STORAGE_KEY = 'noosphere_mindmapper_maps';

function wait() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 10);
  });
}

async function persistMaps(payload) {
  await wait();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

const mindMapperService = {
  persistMaps
};

export default mindMapperService;
