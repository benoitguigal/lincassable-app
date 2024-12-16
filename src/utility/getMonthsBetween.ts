function getMonthsBetween(startDate: string, endDate: string) {
  // Assurez-vous que les dates sont des objets Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Résultat : tableau des dates de début de mois
  const startOfMonths = [];

  // Initialiser une date courante au premier jour du mois de startDate
  const current = new Date(start.getFullYear(), start.getMonth(), 1);

  // Ajouter les dates de début de mois jusqu'à endDate
  while (current <= end) {
    startOfMonths.push(new Date(current)); // Ajouter une copie de la date courante
    // Passer au mois suivant
    current.setMonth(current.getMonth() + 1);
  }

  return startOfMonths;
}

export default getMonthsBetween;
