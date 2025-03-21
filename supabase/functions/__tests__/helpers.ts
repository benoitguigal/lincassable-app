export async function waitFor(
  assertion: () => void | Promise<void>,
  {
    timeout = 5000, // Temps maximum d'attente (ms)
    interval = 100, // Intervalle entre chaque tentative (ms)
  } = {}
): Promise<void> {
  const startTime = Date.now();

  for (;;) {
    try {
      await assertion();
      return; // Succès, on sort de la boucle
    } catch (error) {
      if (Date.now() - startTime < timeout) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      } else {
        throw error;
      }
    }
  }
}
