import unittest
from report_contract import require_complete, EXPECTED_PAGE_CASES, EXPECTED_RUNNER_CASES


class ReportContractTests(unittest.TestCase):
    def setUp(self):
        self.expected = EXPECTED_PAGE_CASES + EXPECTED_RUNNER_CASES
        self.rows = [{'name': name, 'pass': True} for name in self.expected]

    def test_complete(self):
        require_complete(self.rows, self.expected)

    def test_empty(self):
        with self.assertRaises(ValueError):
            require_complete([], self.expected)

    def test_missing(self):
        with self.assertRaises(ValueError):
            require_complete(self.rows[:-1], self.expected)

    def test_duplicate(self):
        with self.assertRaises(ValueError):
            require_complete(self.rows[:-1] + self.rows[:1], self.expected)

    def test_non_boolean(self):
        self.rows[0]['pass'] = 'false'
        with self.assertRaises(ValueError):
            require_complete(self.rows, self.expected)

    def test_failed_case_is_valid_evidence(self):
        self.rows[0]['pass'] = False
        require_complete(self.rows, self.expected)
        self.assertFalse(all(row['pass'] for row in self.rows))
