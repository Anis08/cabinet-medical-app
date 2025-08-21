import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mt-2">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Page précédente
            </button>

            <Link
              to="/patients"
              className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Search className="h-4 w-4 mr-1" />
              Rechercher un patient
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xs text-gray-400">
            Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur système.
          </p>
        </div>
      </div>
    </div>
  );
}